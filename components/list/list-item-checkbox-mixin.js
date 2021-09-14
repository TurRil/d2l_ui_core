import '../selection/selection-input.js';
import { css, html } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LabelledMixin } from '../../mixins/labelled-mixin.js';
import { nothing } from 'lit-html';
import { SelectionInfo } from '../selection/selection-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export const ListItemCheckboxMixin = superclass => class extends SkeletonMixin(LabelledMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * Value to identify item if selectable
			 */
			key: { type: String, reflect: true },
			/**
			 * Indicates a input should be rendered for selecting the item
			 */
			selectable: { type: Boolean },
			/**
			 * Whether the item is selected
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * Private. The selection info (set by the selection component).
			 */
			selectionInfo: { type: Object, attribute: false }
		};
	}

	static get styles() {
		const styles = [ css`
			.d2l-checkbox-action {
				cursor: pointer;
				display: block;
				height: 100%;
			}
			.d2l-checkbox-action.d2l-checkbox-action-disabled {
				cursor: default;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.selectionInfo = new SelectionInfo();
		this._checkboxId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.selectable) {
			if (!this.key) console.warn('ListItemCheckboxMixin requires a key.');
			if (!this.label || this.label.length === 0) console.warn('ListItemCheckboxMixin requires a label.');
		}
		if (!this.key) this.setSelected(undefined, true);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!this._selectionProvider || !changedProperties.has('selectionInfo')) return;
		this.selected = (this.selectionInfo.state === SelectionInfo.states.all);
	}

	setSelected(selected, suppressEvent = false) {
		//if (this.selected === selected) return;
		if (this.selected === selected || (this.selected === undefined && !selected)) return;
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	_dispatchSelected(value) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-selected', {
			detail: { key: this.key, selected: value },
			bubbles: true
		}));
	}

	_onCheckboxActionClick(event) {
		event.preventDefault();
		if (this.disabled) return;
		this.setSelected(!this.selected);
		const checkbox = this.shadowRoot.querySelector(`#${this._checkboxId}`);
		if (checkbox) checkbox.focus();
	}

	_onCheckboxChange(event) {
		this.setSelected(event.target.selected);
		if (this._selectionProvider) {
			if (this.selected && this.selectionInfo.state !== SelectionInfo.states.all || !this.selected && this.selectionInfo.state === SelectionInfo.states.all) {
				this._selectionProvider.setSelectionForAll(this.selected);
			}
		}
	}

	_onNestedSlotChange(e) {
		if (!this.selectable) return;

		const nestedList = e.target.assignedNodes().find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'D2L-LIST'));
		if (this._selectionProvider === nestedList) return;

		if (this._selectionProvider && this._selectionProvider !== nestedList) {
			this._selectionProvider.unsubscribeObserver(this);
			this._selectionProvider = null;
		}

		if (nestedList) {
			this._selectionProvider = nestedList;
			this._selectionProvider.subscribeObserver(this);
		}
	}

	_renderCheckbox() {
		return this.selectable ? html`
			<d2l-selection-input
				@d2l-selection-change="${this._onCheckboxChange}"
				?selected="${this.selected}"
				?disabled="${this.disabled}"
				id="${this._checkboxId}"
				?_indeterminate="${this.selectionInfo.state === SelectionInfo.states.some}"
				key="${this.key}"
				label="${this.label}"
				?skeleton="${this.skeleton}"
				.hovering="${this._hovering}">
			</d2l-selection-input>
		` : nothing;
	}

	_renderCheckboxAction(inner) {
		const classes = {
			'd2l-checkbox-action': true,
			'd2l-checkbox-action-disabled': this.disabled
		};
		return this.selectable ? html`
			<div @click="${this._onCheckboxActionClick}"
				class="${classMap(classes)}">
				${inner}
			</div>
			` : nothing;
	}
};
