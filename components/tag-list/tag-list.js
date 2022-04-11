import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { ArrowKeysMixin } from '../../mixins/arrow-keys-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit/directives/style-map.js';

const PAGE_SIZE = {
	medium: 600,
	large: 970
};
const PAGE_SIZE_LINES = {
	large: 1,
	medium: 2,
	small: 3
};
const MARGIN_TOP_RIGHT = 6;

class TagList extends LocalizeCoreElement(ArrowKeysMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description of the tag list for additional accessibility context
			 * @type {string}
			 */
			description: { type: String },
			_chompIndex: { type: Number },
			_lines: { type: Number },
			_showHiddenTags: { type: Boolean }
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
			}
			::slotted(*),
			d2l-button-subtle {
				margin: 6px 6px 0 0;
			}
			::slotted([data-is-chomped]) {
				display: none !important;
			}
			.d2l-tag-list-hidden-button {
				position: absolute;
				visibility: hidden;
			}
		`;
	}

	constructor() {
		super();
		/** @ignore */
		this.arrowKeysDirection = 'leftrightupdown';
		this._chompIndex = 10000;
		this._hasResized = false;
		this._resizeObserver = null;
		this._showHiddenTags = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (this._subtleButtonResizeObserver) this._subtleButtonResizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const subtleButton  = this.shadowRoot.querySelector('.d2l-tag-list-hidden-button');
		this._subtleButtonResizeObserver = new ResizeObserver(() => {
			this._subtleButtonWidth = Math.ceil(parseFloat(getComputedStyle(subtleButton).getPropertyValue('width')));
		});
		this._subtleButtonResizeObserver.observe(subtleButton);

		const container = this.shadowRoot.querySelector('.tag-list-outer-container');
		this._resizeObserver = new ResizeObserver((e) => requestAnimationFrame(() => this._handleResize(e)));
		this._resizeObserver.observe(container);
	}

	render() {
		let hiddenCount = 0;
		let hasHiddenTags = false;
		if (this._items) {
			this._items.forEach((element, index) => {
				if (index >= this._chompIndex) hasHiddenTags = true;
				if (!this._showHiddenTags && index >= this._chompIndex) {
					hiddenCount++;
					element.setAttribute('data-is-chomped', '');
				} else {
					element.removeAttribute('data-is-chomped');
				}
			});
		}

		let button = null;
		if (hasHiddenTags) {
			button = this._showHiddenTags ? html`
				<d2l-button-subtle
					class="d2l-tag-list-button"
					@click="${this._toggleHiddenTagVisibility}"
					slim
					text="${this.localize('components.tag-list.show-less')}">
				</d2l-button-subtle>
			` : html`
				<d2l-button-subtle
					class="d2l-tag-list-button"
					@click="${this._toggleHiddenTagVisibility}"
					slim
					text="${this.localize('components.tag-list.num-hidden', { count: hiddenCount })}">
				</d2l-button-subtle>
			`;
		}

		const list = html`
			<div role="list" class="tag-list-container" aria-describedby="d2l-tag-list-description">
				<slot @slotchange="${this._handleSlotChange}"></slot>
				${button}
			</div>
		`;

		const outerContainerStyles = {
			maxHeight: (this._showHiddenTags || !this._lines) ? undefined : `${(this._itemHeight + MARGIN_TOP_RIGHT) * this._lines}px`
		};

		return html`
			<div role="application" class="tag-list-outer-container" style="${styleMap(outerContainerStyles)}">
				<d2l-button-subtle aria-hidden="true" slim text="${this.localize('components.tag-list.num-hidden', { count: '##' })}" class="d2l-tag-list-hidden-button"></d2l-button-subtle>
				${this.arrowKeysContainer(list)}
				<div id="d2l-tag-list-description" hidden>${this.description}</div>
			</div>
		`;
	}

	async arrowKeysFocusablesProvider() {
		return this._showHiddenTags ? this._items : this._items.slice(0, this._chompIndex);
	}

	focus() {
		if (this._items && this._items.length > 0) this._items[0].focus();
	}

	_chomp() {
		if (!this.shadowRoot || !this._lines || !this._itemLayouts) return;

		const showing = {
			count: 0,
			width: 0
		};

		/**
		 * _lines is determined by page width in _handleResize function
		 * For each line we calculate the max items that can fit in that width, then go to the next line
		 * If on the last line there is/are item(s) that won't fit in the width, we mark them as soft-hide and set isOverflowing
		 */
		let isOverflowing = false;
		let overflowingIndex = 0;
		for (let k = 1; k <= this._lines; k++) {
			showing.width = 0;

			for (let i = overflowingIndex; i < this._itemLayouts.length; i++) {
				const itemLayout = this._itemLayouts[i];
				const itemWidth = Math.min(itemLayout.width, this._availableWidth);

				if (!isOverflowing && ((showing.width + itemWidth) <= (this._availableWidth + MARGIN_TOP_RIGHT))) {
					showing.width += itemWidth;
					showing.count += 1;
					itemLayout.trigger = 'soft-show';
				} else if (k < this._lines) {
					overflowingIndex = i;
					break;
				} else {
					isOverflowing = true;
					itemLayout.trigger = 'soft-hide';
				}
			}
		}

		if (!isOverflowing) {
			this._chompIndex = showing.count;
			return;
		}

		// calculate if additional item(s) should be hidden due to subtle button needing space
		for (let j = this._itemLayouts.length; j--;) {
			if ((showing.width + this._subtleButtonWidth) < this._availableWidth) {
				break;
			}
			const itemLayoutOverflowing = this._itemLayouts[j];
			if (itemLayoutOverflowing.trigger !== 'soft-show') {
				continue;
			}
			showing.width -= itemLayoutOverflowing.width;
			showing.count -= 1;
		}
		this._chompIndex = showing.count;
	}

	_getItemLayouts(filteredNodes) {
		const items = filteredNodes.map((node) => {
			const computedStyles = window.getComputedStyle(node);

			return {
				isHidden: computedStyles.display === 'none',
				width: Math.ceil(parseFloat(computedStyles.width) || 0)
					+ parseInt(computedStyles.marginRight) || 0
					+ parseInt(computedStyles.marginLeft) || 0
			};
		});

		return items.filter(({ isHidden }) => !isHidden);
	}

	_getTagListItems() {
		const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
		if (!slot) return;
		return slot.assignedNodes({ flatten: true }).filter((node) => {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			const role = node.getAttribute('role');
			node.removeAttribute('data-is-chomped');
			return (role === 'listitem');
		});
	}

	_handleResize(entries) {
		this._availableWidth = Math.floor(entries[0].contentRect.width);
		if (this._availableWidth >= PAGE_SIZE.large) this._lines = PAGE_SIZE_LINES.large;
		else if (this._availableWidth < PAGE_SIZE.large && this._availableWidth >= PAGE_SIZE.medium) this._lines = PAGE_SIZE_LINES.medium;
		else this._lines = PAGE_SIZE_LINES.small;
		if (!this._hasResized) {
			this._hasResized = true;
			this._handleSlotChange();
		}
		this._chomp();
	}

	_handleSlotChange() {
		if (!this._hasResized) return;

		requestAnimationFrame(async() => {
			this._items = this._getTagListItems();
			if (!this._items || this._items.length === 0) return;

			await Promise.all(this._items.map(item => item.updateComplete));

			this._itemLayouts = this._getItemLayouts(this._items);
			this._itemHeight = this._items[0].offsetHeight;
			this._items.forEach((item, index) => {
				item.setAttribute('tabIndex', index === 0 ? 0 : -1);
			});
			this._chomp();
			this.requestUpdate();
		});
	}

	async _toggleHiddenTagVisibility() {
		this._showHiddenTags = !this._showHiddenTags;

		if (!this.shadowRoot) return;

		await this.updateComplete;
		const button = this.shadowRoot.querySelector('.d2l-tag-list-button');
		if (button) button.focus();
	}

}

customElements.define('d2l-tag-list', TagList);
