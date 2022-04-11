import { LitElement } from 'lit';
import { TagListItemMixin } from './tag-list-item-mixin.js';

class TagListItem extends TagListItemMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Text to display
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	render() {
		return this._renderTag(this.text, true);
	}
}

customElements.define('d2l-tag-list-item', TagListItem);
