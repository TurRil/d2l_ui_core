import { css, html } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '../helpers/dom.js';
import { forceFocusVisible, getNextFocusable } from '../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../helpers/localize-core-element.js';

const keyCodes = {
	ENTER: 13,
	ESCAPE: 27
};

export const InteractiveMixin = superclass => class extends LocalizeCoreElement(superclass) {

	static get properties() {
		return {
			_hasInteractiveAncestor: { state: true },
			_interactive: { state: true }
		};
	}

	static get styles() {
		return css`
			.interactive-container.focus-visible,
			.interactive-container:focus-visible {
				border-radius: 6px;
				outline: 2px solid var(--d2l-color-celestine);
				outline-offset: 2px;
			}
		`;
	}

	constructor() {
		super();
		this._hasInteractiveAncestor = false;
		this._interactive = false;
	}

	connectedCallback() {
		super.connectedCallback();

		const parentGrid = findComposedAncestor(this.parentNode, node => {
			return ((node.tagName === 'D2L-LIST' && node.grid) || (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('role') === 'grid'));
		});
		this._hasInteractiveAncestor = (parentGrid !== null);
	}

	focus() {
		if (!this.shadowRoot) return;
		if (this._hasInteractiveAncestor && !this._interactive) forceFocusVisible(this.shadowRoot.querySelector('.interactive-container'));
		else this._focusDelegate();
	}

	renderInteractiveContainer(inner, label, focusDelegate) {
		if (!label) {
			throw new Error(`InteractiveMixin: no label provided for "${this.tagName}"`);
		}
		if (!focusDelegate) {
			throw new Error(`InteractiveMixin: no focus delegate provided for "${this.tagName}"`);
		}
		this._focusDelegate = focusDelegate;
		if (!this._hasInteractiveAncestor) return inner;
		return html`
			<div class="interactive-container"
				aria-label="${label}"
				aria-description="${this.localize('components.interactive.instructions')}"
				@keydown="${this._handleInteractiveKeyDown}"
				role="button"
				tabindex="${ifDefined(this._hasInteractiveAncestor && !this._interactive ? '0' : undefined)}">
					<span class="interactive-trap-start" @focus="${this._handleInteractiveStartFocus}" tabindex="${ifDefined(this._hasInteractiveAncestor ? '0' : undefined)}"></span>
					<div class="interactive-container-content" @focusin="${this._handleInteractiveContentFocusIn}" @focusout="${this._handleInteractiveContentFocusOut}">${inner}</div>
					<span class="interactive-trap-end" @focus="${this._handleInteractiveEndFocus}" tabindex="${ifDefined(this._hasInteractiveAncestor ? '0' : undefined)}"></span>
			</div>
		`;
	}

	_handleInteractiveContentFocusIn() {
		this._interactive = true;
	}

	_handleInteractiveContentFocusOut(e) {
		if (isComposedAncestor(this.shadowRoot.querySelector('.interactive-container-content'), e.relatedTarget)) return;
		// focus moved out of the interactive content
		this._interactive = false;
	}

	async _handleInteractiveEndFocus() {
		// focus moved to trap-end either forwards from contents or backwards from outside - focus interactive toggle
		this._interactive = false;
		await this.updateComplete;
		this.shadowRoot.querySelector('.interactive-container').focus();
	}

	async _handleInteractiveKeyDown(e) {
		if (!this._interactive && e.keyCode === keyCodes.ENTER) {
			this._interactive = true;
			await this.updateComplete;
			this.focus();
		} else if (this._interactive && e.keyCode === keyCodes.ESCAPE) {
			this._interactive = false;
			await this.updateComplete;
			this.shadowRoot.querySelector('.interactive-container').focus();
		}
	}

	async _handleInteractiveStartFocus(e) {
		if (e.relatedTarget === this.shadowRoot.querySelector('.interactive-container')) {
			// focus moved to trap-start while non-interactive - focus next focusable after this component
			const nextFocusable = getNextFocusable(this.shadowRoot.querySelector('.interactive-trap-end'));
			if (nextFocusable) nextFocusable.focus();
		} else {
			// focus moved to trap-start backwards from within contents - toggle to non-interactive and apply focus
			this._interactive = false;
			await this.updateComplete;
			this.shadowRoot.querySelector('.interactive-container').focus();
		}
	}

};
