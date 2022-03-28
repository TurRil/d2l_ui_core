import { css, html, LitElement } from 'lit';
import { ArrowKeysMixin } from '../../mixins/arrow-keys-mixin.js';

class TagList extends ArrowKeysMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description of the tag list for additional accessibility context
			 * @type {string}
			 */
			description: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.tag-list-container {
				display: flex;
				flex-wrap: wrap;
				margin: -6px -6px 0 0;
				padding: 0;
				position: relative;
			}
			::slotted(*) {
				margin: 6px 6px 0 0;
			}
		`;
	}

	constructor() {
		super();
		/** @ignore */
		this.arrowKeysDirection = 'leftrightupdown';
		this._items = [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		requestAnimationFrame(() => {
			this._items = this._getTagListItems();
			this._items.forEach((item, index) => {
				item.setAttribute('tabIndex', index === 0 ? 0 : -1);
			});
		});
	}

	render() {
		const list = html`
			<div role="list" class="tag-list-container" aria-describedby="d2l-tag-list-description">
				<slot></slot>
			</div>
		`;
		return html`
			<div role="application">
				${this.arrowKeysContainer(list)}
				<div id="d2l-tag-list-description" hidden>${this.description}</div>
			</div>
		`;
	}

	async arrowKeysFocusablesProvider() {
		return this._items;
	}

	focus() {
		if (this._items.length > 0) this._items[0].focus();
	}

	_getTagListItems() {
		const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
		if (!slot) return;
		return slot.assignedNodes({ flatten: true }).filter((node) => {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			const role = node.getAttribute('role');
			return (role === 'listitem');
		});
	}

}

customElements.define('d2l-tag-list', TagList);
