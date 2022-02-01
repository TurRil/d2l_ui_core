import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A subtle button that selects all items for all pages.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class SelectAllPages extends LocalizeCoreElement(SelectionObserverMixin(LitElement)) {

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	render() {
		if (!this._provider) return;
		if (!this._provider.itemCount) return;
		if (this._provider.selectionSingle) return;
		if (this.selectionInfo.state !== SelectionInfo.states.all) return;

		return html`
			<d2l-button-subtle
				@click="${this._handleClick}"
				text="${this.localize('components.selection.select-all-items', 'count', this._provider.itemCount)}">
			</d2l-button-subtle>`;
	}

	focus() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('d2l-button-subtle');
		if (elem) elem.focus();
	}

	_handleClick() {
		if (this._provider) this._provider.setSelectionForAll(true, true);
	}

}

customElements.define('d2l-selection-select-all-pages', SelectAllPages);
