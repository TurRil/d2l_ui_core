import '../colors/colors.js';
import { css, LitElement } from 'lit';
import { HtmlAttributeObserverController } from '../../controllers/attributeObserver/htmlAttributeObserverController.js';
import { HtmlBlockMathRenderer } from '../../helpers/mathjax.js';
import { requestInstance } from '../../mixins/provider-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export const htmlBlockContentStyles = css`
	.d2l-html-block-compact {
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.2rem;
	}
	h1, h2, h3, h4, h5, h6, b, strong, b *, strong * {
		font-weight: bold;
	}
	h1 {
		font-size: 2em;
		line-height: 37px;
		margin: 21.43px 0;
	}
	h2 {
		font-size: 1.5em;
		line-height: 27px;
		margin: 19.92px 0;
	}
	h3 {
		font-size: 1.2em;
		line-height: 23px;
		margin: 18.72px 0;
	}
	h4 {
		font-size: 1em;
		line-height: 20px;
		margin: 21.28px 0;
	}
	h5 {
		font-size: 0.83em;
		line-height: 16px;
		margin: 22.13px 0;
	}
	h6 {
		font-size: 0.67em;
		line-height: 13px;
		margin: 24.97px 0;
	}
	pre {
		font-family: Monospace;
		font-size: 13px;
		margin: 13px 0;
	}
	p {
		margin: 0.5em 0 1em 0;
	}
	ul, ol {
		list-style-position: outside;
		margin: 1em 0;
		padding-inline-start: 3em;
	}
	.d2l-html-block-compact ul,
	.d2l-html-block-compact ol {
		padding-inline-start: 1.5em;
	}
	ul, ul[type="disc"] {
		list-style-type: disc;
	}
	ul ul, ul ol,
	ol ul, ol ol {
		margin-bottom: 0;
		margin-top: 0;
	}
	ul ul, ol ul, ul[type="circle"] {
		list-style-type: circle;
	}
	ul ul ul, ul ol ul,
	ol ul ul, ol ol ul,
	ul[type="square"] {
		list-style-type: square;
	}
	a,
	a:visited,
	a:link,
	a:active {
		color: var(--d2l-color-celestine, #006fbf);
		cursor: pointer;
		text-decoration: none;
	}
	a:hover,
	a:focus {
		color: var(--d2l-color-celestine-minus-1, #004489);
		outline-width: 0;
		text-decoration: underline;
	}
	@media print {
		a,
		a:visited,
		a:link,
		a:active {
			color: var(--d2l-color-ferrite, #494c4e);
		}
	}
	mjx-assistive-mml math {
		position: absolute;
	}
	:host([dir="rtl"]) {
		text-align: right;
	}
`;

let renderers;

const getRenderers = () => {
	if (renderers) return renderers;
	const tempRenderers = requestInstance(document, 'html-block-renderers');
	const htmlBlockMathRenderer = new HtmlBlockMathRenderer();
	renderers = (tempRenderers ? [ htmlBlockMathRenderer, ...tempRenderers ] : [ htmlBlockMathRenderer ]);
	return renderers;
};

/**
 * A component for displaying user-authored HTML.
 * @slot - Provide your user-authored HTML
 */
class HtmlBlock extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether compact styles should be applied
			 * @type {Boolean}
			 */
			compact: { type: Boolean },
			/**
			 * Whether to disable deferred rendering of the user-authored HTML. Do *not* set this
			 * unless your HTML relies on script executions that may break upon stamping.
			 * @type {Boolean}
			 */
			noDeferredRendering: { type: Boolean, attribute: 'no-deferred-rendering' }
		};
	}

	static get styles() {
		return [ htmlBlockContentStyles, css`
			:host {
				display: block;
				overflow-wrap: break-word;
				overflow-x: auto;
				overflow-y: hidden;
				position: relative;
				text-align: left;
			}
			:host([hidden]) {
				display: none;
			}
			:host([no-deferred-rendering]) div.d2l-html-block-rendered {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.compact = false;
		this.noDeferredRendering = false;

		const rendererContextAttributes = getRenderers().reduce((attrs, currentRenderer) => {
			if (currentRenderer.contextAttributes) currentRenderer.contextAttributes.forEach(attr => attrs.push(attr));
			return attrs;
		}, []);

		if (rendererContextAttributes.length === 0) return;
		this._contextObserverController = new HtmlAttributeObserverController(this, ...rendererContextAttributes);
	}

	connectedCallback() {
		super.connectedCallback();

		if (!this._contentObserver || this.noDeferredRendering) return;

		const slot = this.shadowRoot.querySelector('slot');
		if (slot) {
			slot.assignedNodes({ flatten: true }).forEach(
				node => this._contentObserver.observe(node, { attributes: true, childList: true, subtree: true })
			);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._contentObserver) this._contentObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this._renderContainer) return;
		this.shadowRoot.innerHTML += `<div class="d2l-html-block-rendered${this.compact ? ' d2l-html-block-compact' : ''}"></div><slot ${!this.noDeferredRendering ? 'style="display: none"' : ''}></slot>`;

		this.shadowRoot.querySelector('slot').addEventListener('slotchange', async e => await this._render(e.target));
		this._renderContainer = this.shadowRoot.querySelector('.d2l-html-block-rendered');
		this._context = this._contextObserverController ? { ...this._contextObserverController.values } : {};
	}

	updated() {
		super.updated();
		if (this._contextObserverController && this._contextObjectHasChanged()) this._render();
	}

	_contextObjectHasChanged() {
		if (this._context.size !== this._contextObserverController.values.size) return true;
		for (const [attr, val] of this._context) {
			if (!this._contextObserverController.values.has(attr)) return true;
			if (this._contextObserverController.values.get(attr) !== val) return true;
		}
		return false;
	}

	async _processRenderers(elem) {
		for (const renderer of getRenderers()) {
			if (this._contextObserverController && renderer.contextAttributes) {
				const contextValues = new Map();
				renderer.contextAttributes.forEach(attr => contextValues.set(attr, this._contextObserverController.values.get(attr)));
				elem = await renderer.render(elem, {
					contextValues: contextValues,
					noDeferredRendering: this.noDeferredRendering
				});
			} else {
				elem = await renderer.render(elem, {
					noDeferredRendering: this.noDeferredRendering
				});
			}
		}

		return elem;
	}

	async _render(slot) {
		if (this.noDeferredRendering) await this._renderInline(slot);
		else this._stamp(slot);
	}

	async _renderInline(slot) {
		if (!this.shadowRoot) return;
		if (!slot) slot = this.shadowRoot.querySelector('slot');

		const noDeferredRenderingContainer = slot.assignedNodes({ flatten: true })
			.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV'));

		if (!noDeferredRenderingContainer) return;
		await this._processRenderers(noDeferredRenderingContainer);
	}

	_stamp(slot) {
		const stampHTML = async nodes => {
			if (nodes && nodes.length > 0) {

				let temp = document.createElement('div');
				temp.style.display = 'none';
				nodes.forEach(node => temp.appendChild(node.cloneNode(true)));

				this._renderContainer.appendChild(temp);
				temp = await this._processRenderers(temp);
				this._renderContainer.innerHTML = temp.innerHTML;

			} else {
				this._renderContainer.innerHTML = '';
			}
		};

		if (this._contentObserver) this._contentObserver.disconnect();

		if (!slot) slot = this.shadowRoot.querySelector('slot');
		const slottedNodes = slot.assignedNodes({ flatten: true });

		this._contentObserver = new MutationObserver(() => stampHTML(slottedNodes));
		slottedNodes.forEach(
			node => this._contentObserver.observe(node, { attributes: true, childList: true, subtree: true })
		);

		stampHTML(slottedNodes);
	}

}

customElements.define('d2l-html-block', HtmlBlock);
