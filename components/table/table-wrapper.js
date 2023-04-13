import '../colors/colors.js';
import '../scroll-wrapper/scroll-wrapper.js';
import { css, html, LitElement, nothing } from 'lit';
import { PageableMixin } from '../paging/pageable-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SelectionMixin } from '../selection/selection-mixin.js';

export const tableStyles = css`
	.d2l-table {
		border-collapse: separate; /* needed to override reset stylesheets */
		border-spacing: 0;
		font-size: 0.8rem;
		font-weight: 400;
		width: 100%;
	}

	.d2l-table > tbody,
	.d2l-table > tfoot {
		background-color: #ffffff;
	}

	/* all cells */
	.d2l-table > * > tr > * {
		border-bottom: var(--d2l-table-border);
		font-weight: inherit;
		height: var(--d2l-table-cell-height);
		padding: var(--d2l-table-cell-padding);
		text-align: left;
		vertical-align: middle;
	}
	d2l-table-wrapper[dir="rtl"] .d2l-table > * > tr > * {
		text-align: right;
	}

	/* default cells */
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > * > tr > *,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > * > tr > .d2l-table-cell-first {
		border-right: var(--d2l-table-border);
	}
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > * > tr > *,
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > * > tr > .d2l-table-cell-first {
		border-left: var(--d2l-table-border);
	}
	d2l-table-wrapper[type="default"] .d2l-table-row-first > * {
		border-top: var(--d2l-table-border); /* add top border to default first row */
	}

	/* header cells */
	.d2l-table > thead > tr > th,
	.d2l-table > * > tr.d2l-table-header > th,
	.d2l-table > * > tr[header] > th {
		background-color: var(--d2l-table-header-background-color);
		font-size: 0.7rem;
		line-height: 0.9rem;
	}
	d2l-table-wrapper[type="default"] .d2l-table > thead > tr > th,
	d2l-table-wrapper[type="default"] .d2l-table > * > tr.d2l-table-header > th,
	d2l-table-wrapper[type="default"] .d2l-table > * > tr[header] > th {
		height: 27px; /* min-height to be 48px including border */
	}

	/* border radiuses */
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-first > .d2l-table-cell-first,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-first > .d2l-table-cell-last {
		border-top-left-radius: var(--d2l-table-border-radius);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-first > .d2l-table-cell-last,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-first > .d2l-table-cell-first {
		border-top-right-radius: var(--d2l-table-border-radius);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-last > .d2l-table-cell-first,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-last > .d2l-table-cell-last {
		border-bottom-left-radius: var(--d2l-table-border-radius);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-last > .d2l-table-cell-last,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-last > .d2l-table-cell-first {
		border-bottom-right-radius: var(--d2l-table-border-radius);
	}

	/* selected rows */
	.d2l-table > tbody > tr[selected] {
		background-color: var(--d2l-table-row-background-color-selected);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > tbody > tr[selected] > .d2l-table-cell-last,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > tbody > tr[selected] > .d2l-table-cell-first {
		border-right-color: var(--d2l-table-row-border-color-selected);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > tbody > tr[selected] > .d2l-table-cell-first,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > tbody > tr[selected] > .d2l-table-cell-last {
		border-left-color: var(--d2l-table-row-border-color-selected);
	}
	.d2l-table > tbody > tr[selected] > *,
	.d2l-table > * > tr.d2l-table-selected-previous > * {
		border-bottom-color: var(--d2l-table-row-border-color-selected);
	}
	.d2l-table > * > tr.d2l-table-selected-first > * {
		border-top: 1px solid var(--d2l-table-row-border-color-selected);
		padding: var(--d2l-table-cell-padding-alt);
	}

	/* no-column-border */
	d2l-table-wrapper[type="default"][no-column-border]:not([dir="rtl"]) .d2l-table > tbody > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table[no-column-border] > tbody > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"][no-column-border]:not([dir="rtl"]) .d2l-table > thead > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table[no-column-border] > thead > tr > *:not(.d2l-table-cell-last) {
		border-right: none;
	}
	d2l-table-wrapper[type="default"][no-column-border][dir="rtl"] .d2l-table > tbody > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table[no-column-border] > tbody > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"][no-column-border][dir="rtl"] .d2l-table > thead > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table[no-column-border] > thead > tr > *:not(.d2l-table-cell-last) {
		border-left: none;
	}

	/* sticky-headers */

	/* all header cells */
	d2l-table-wrapper[sticky-headers] .d2l-table > thead > tr > th,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr.d2l-table-header > *,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr[header] > * {
		position: -webkit-sticky;
		position: sticky;
		z-index: 2;
	}

	/* header cells that are also sticky */
	d2l-table-wrapper[sticky-headers] .d2l-table > thead > tr > th.d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > thead > tr > th[sticky],
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr.d2l-table-header > .d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr.d2l-table-header > [sticky],
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr[header] > .d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr[header] > [sticky] {
		left: 0;
		z-index: 3;
	}
	d2l-table-wrapper[dir="rtl"][sticky-headers] .d2l-table > * > tr > .d2l-table-sticky-cell,
	d2l-table-wrapper[dir="rtl"][sticky-headers] .d2l-table > * > tr > [sticky] {
		right: 0;
	}

	/* first column that's sticky: offset by size of border-radius so top/bottom border doesn't show through (default style only) */
	d2l-table-wrapper[sticky-headers][type="default"]:not([dir="rtl"]) .d2l-table > * > tr > .d2l-table-sticky-cell.d2l-table-cell-first,
	d2l-table-wrapper[sticky-headers][type="default"]:not([dir="rtl"]) .d2l-table > * > tr > [sticky].d2l-table-cell-first {
		left: var(--d2l-table-border-radius-sticky-offset, 0);
	}
	d2l-table-wrapper[sticky-headers][type="default"][dir="rtl"] .d2l-table > * > tr > .d2l-table-sticky-cell.d2l-table-cell-first,
	d2l-table-wrapper[sticky-headers][type="default"][dir="rtl"] .d2l-table > * > tr > [sticky].d2l-table-cell-first {
		right: var(--d2l-table-border-radius-sticky-offset, 0);
	}

	/* non-header sticky cells */
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr:not([selected]) {
		background-color: inherit; /* white background so sticky cells layer on top of non-sticky cells */
	}
	d2l-table-wrapper[sticky-headers] .d2l-table > tbody > tr:not([header]):not(.d2l-table-header) > .d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > tbody > tr:not([header]):not(.d2l-table-header) > [sticky] {
		background-color: inherit;
		left: 0;
		position: -webkit-sticky;
		position: sticky;
		z-index: 1;
	}
`;

/**
 * Wraps a native <table> element, providing styling and scroll buttons for overflow.
 * @slot - Content to wrap
 * @slot controls - Slot for `d2l-table-controls` to be rendered above the table
 * @slot pager - Slot for `d2l-pager-load-more` to be rendered below the table
 */
export class TableWrapper extends RtlMixin(PageableMixin(SelectionMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Hides the column borders on "default" table type
			 * @type {boolean}
			 */
			noColumnBorder: {
				attribute: 'no-column-border',
				reflect: true,
				type: Boolean
			},
			/**
			 * Whether the header row is sticky. Useful for long tables to "stick" the header row in place as the user scrolls.
			 * @type {boolean}
			 */
			stickyHeaders: {
				attribute: 'sticky-headers',
				reflect: true,
				type: Boolean
			},
			/**
			 * Type of table style to apply. The "light" style has fewer borders and tighter padding.
			 * @type {'default'|'light'}
			 */
			type: {
				reflect: true,
				type: String
			},
			_controlsScrolled: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-table-border: 1px solid var(--d2l-table-border-color);
				--d2l-table-border-color: var(--d2l-color-mica);
				--d2l-table-border-radius: 0.3rem;
				--d2l-table-border-radius-sticky-offset: calc(1px - var(--d2l-table-border-radius));
				--d2l-table-cell-height: 41px; /* min-height to be 62px including border */
				--d2l-table-cell-padding: 0.5rem 1rem;
				--d2l-table-cell-padding-alt: calc(0.5rem - 1px) 1rem 0.5rem 1rem;
				--d2l-table-header-background-color: var(--d2l-color-regolith);
				--d2l-table-row-border-color-selected: var(--d2l-color-celestine);
				--d2l-table-row-background-color-selected: var(--d2l-color-celestine-plus-2);
				display: block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			:host([type="light"]) {
				--d2l-table-border-radius: 0rem; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-border-radius-sticky-offset: 0rem; /* stylelint-disable-line length-zero-no-unit */
				--d2l-table-cell-height: 1.15rem; /* min-height to be 48px including border */
				--d2l-table-cell-padding: 0.6rem;
				--d2l-table-cell-padding-alt: calc(0.6rem - 1px) 0.6rem 0.6rem 0.6rem;
				--d2l-table-border-color: var(--d2l-color-gypsum);
				--d2l-table-header-background-color: #ffffff;
			}
			:host([sticky-headers]) {
				--d2l-table-controls-shadow-display: none;
			}
			.d2l-sticky-headers-backdrop {
				position: sticky;
				top: calc(var(--d2l-table-sticky-top, 0px) + var(--d2l-table-border-radius));
				width: 100%;
				z-index: 2; /* Must sit under d2l-table sticky-headers but over sticky columns and regular cells */
			}
			.d2l-sticky-headers-backdrop::after {
				background-color: var(--d2l-table-controls-background-color, white);
				bottom: 0;
				content: "";
				position: absolute;
				top: calc(-7px - var(--d2l-table-border-radius)); /* 6px for the d2l-table-controls margin-bottom, 1px overlap to fix zoom issues */
				width: 100%;
			}
			slot[name="pager"]::slotted(*) {
				margin-top: 12px;
			}
		`;
	}

	constructor() {
		super();
		this.noColumnBorder = false;
		this.stickyHeaders = false;
		this.type = 'default';

		this._controls = null;
		this._controlsMutationObserver = null;
		this._controlsScrolled = false;
		this._controlsScrolledMutationObserver = null;
		this._table = null;
		this._tableIntersectionObserver = null;
		this._tableMutationObserver = null;
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this._controlsMutationObserver?.disconnect();
		this._controlsScrolledMutationObserver?.disconnect();
		this._tableMutationObserver?.disconnect();
		this._tableIntersectionObserver?.disconnect();
	}

	render() {
		const slot = html`<slot @slotchange="${this._handleSlotChange}"></slot>`;
		return html`
			<slot name="controls" @slotchange="${this._handleControlsSlotChange}"></slot>
			${this.stickyHeaders && this._controlsScrolled ? html`<div class="d2l-sticky-headers-backdrop"></div>` : nothing}
			${this.stickyHeaders ? slot : html`<d2l-scroll-wrapper>${slot}</d2l-scroll-wrapper>`}
			${this._renderPagerContainer()}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		// hack: grades/groups/outcomes in the LE use this CSS class on the
		// body to apply special CSS to the page when tables are sticky
		// Ideally they should be adding this class to the body.
		if (changedProperties.has('stickyHeaders')) {
			if (this.stickyHeaders) {
				document.body.classList.add('d2l-table-sticky-headers');
			}
		}
	}

	_applyClassNames() {
		if (!this._table) return;

		// offsetParent causes reflow/paint so do them all at once
		const rows = Array.from(this._table.rows);
		let firstRow = null;
		let lastRow = null;
		rows.forEach((r) => {
			if (r.offsetParent === null) return;
			firstRow = firstRow || r;
			lastRow = r;
		});

		let prevRow = null;
		let skipFirst = 0;
		rows.forEach((r) => {
			const isHeader = r.parentNode.tagName === 'THEAD' || r.classList.contains('d2l-table-header') || r.hasAttribute('header');
			const isSelected = r.hasAttribute('selected');

			let firstNonHeaderRow = !isHeader;
			if (prevRow) {
				const isPrevRowHeader = prevRow.parentNode.tagName === 'THEAD' || prevRow.hasAttribute('header');
				firstNonHeaderRow = firstNonHeaderRow && isPrevRowHeader;
				prevRow.classList.toggle('d2l-table-selected-previous', isSelected && !isPrevRowHeader);
			}

			r.classList.toggle('d2l-table-row-first', r === firstRow);
			r.classList.toggle('d2l-table-row-last', r === lastRow);
			r.classList.toggle('d2l-table-selected-first', firstNonHeaderRow && isSelected);

			Array.from(r.cells).forEach((c, index) => {
				c.classList.toggle('d2l-table-cell-first', index === 0 && skipFirst === 0);
				if (index === 0 && skipFirst === 0 && c.hasAttribute('rowspan')) {
					skipFirst = parseInt(c.getAttribute('rowspan'));
				}
				c.classList.toggle('d2l-table-cell-last', index === r.cells.length - 1);
			});

			prevRow = r;
			skipFirst = Math.max(0, --skipFirst);
		});
	}

	_getItemByIndex(index) {
		return this._getItems()[index];
	}

	_getItems() {
		return this._table?.querySelectorAll(':not(thead) > tr:not(.d2l-table-header):not([header])') || [];
	}

	_getItemShowingCount() {
		return this._getItems().length;
	}

	async _handleControlsChange() {
		if (this._controls) {
			await this._controls.updateComplete;
			await new Promise(resolve => requestAnimationFrame(resolve));
		}

		this._handleControlsScrolledChange();
		this._updateStickyTops();
	}

	_handleControlsScrolledChange() {
		this._controlsScrolled = this._controls?._scrolled;
	}

	_handleControlsSlotChange(e) {
		this._controls = e.target.assignedNodes({ flatten: true })[0];

		this._registerMutationObserver('_controlsMutationObserver', this._handleControlsChange.bind(this), this._controls, {
			attributes: true,
			attributeFilter: ['hidden', 'no-sticky'],
		});
		this._registerMutationObserver('_controlsScrolledMutationObserver', this._handleControlsScrolledChange.bind(this), this._controls, {
			attributes: true,
			attributeFilter: ['_scrolled'],
		});

		this._handleControlsChange();
	}

	_handleSlotChange(e) {
		this._table = e.target.assignedNodes({ flatten: true }).find(
			node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TABLE' && node.classList.contains('d2l-table'))
		);

		// observes mutations to <table>'s direct children and also
		// its subtree (rows or cells added/removed to any descendant)
		this._registerMutationObserver('_tableMutationObserver', this._handleTableChange.bind(this), this._table, {
			attributes: true, /* required for legacy-Edge, otherwise attributeFilter throws a syntax error */
			attributeFilter: ['selected'],
			childList: true,
			subtree: true
		});

		if (!this._table) return;

		// observes when visibility of <table> changes to catch cases
		// where table is initially hidden (which would cause first/last
		// row classes to be unset) but then becomes shown
		if (typeof(IntersectionObserver) === 'function') {
			if (this._tableIntersectionObserver === null) {
				this._tableIntersectionObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							this._handleTableChange();
						}
					});
				});
			} else {
				this._tableIntersectionObserver.disconnect();
			}
			this._tableIntersectionObserver.observe(this._table);
		}

		this._handleTableChange();
	}

	async _handleTableChange() {
		await new Promise(resolve => requestAnimationFrame(resolve));

		this._updateItemShowingCount();
		this._applyClassNames();
		this._updateStickyTops();
	}

	_registerMutationObserver(observerName, callback, target, options) {
		if (this[observerName]) {
			this[observerName].disconnect();
		} else if (target) {
			this[observerName] = new MutationObserver(callback);
		}
		if (target) this[observerName].observe(target, options);
	}

	_updateStickyTops() {
		const hasStickyControls = this._controls && !this._controls.noSticky;
		let rowTop = hasStickyControls ? this._controls.offsetHeight + 6 : 0; // +6 for the internal `margin-bottom`.
		this.style.setProperty('--d2l-table-sticky-top', `${rowTop}px`);

		if (!this._table || !this.stickyHeaders) return;

		const stickyRows = Array.from(this._table.querySelectorAll('tr.d2l-table-header, tr[header], thead tr'));
		stickyRows.forEach(r => {
			const thTop = hasStickyControls ? `${rowTop}px` : `calc(${rowTop}px + var(--d2l-table-border-radius-sticky-offset, 0px))`;
			const ths = Array.from(r.querySelectorAll('th'));
			ths.forEach(th => th.style.top = thTop);

			const rowHeight = r.querySelector('th:not([rowspan])')?.offsetHeight || 0;
			rowTop += rowHeight;
		});
	}

}

customElements.define('d2l-table-wrapper', TableWrapper);
