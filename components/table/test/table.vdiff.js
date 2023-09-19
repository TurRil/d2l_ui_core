import '../../inputs/input-number.js';
import '../demo/table-test.js';
import '../table-col-sort-button.js';
import { defineCE, expect, fixture, focusElem, html, nextFrame } from '@brightspace-ui/testing';
import { LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { tableStyles } from '../table-wrapper.js';

function createHeaderRow(opts) {
	const { headerAttribute, trClass } = { headerAttribute: false, ...opts };
	return html`
		<tr class="${ifDefined(trClass)}" ?header="${headerAttribute}">
			<th>Header A</th>
			<th>Header B</th>
			<th>Header C</th>
		</tr>
	`;
}
function createSortableHeaderRow() {
	return html`
		<tr>
			<th><d2l-table-col-sort-button>Ascending</d2l-table-col-sort-button></th>
			<th><d2l-table-col-sort-button desc>Descending</d2l-table-col-sort-button></th>
			<th><d2l-table-col-sort-button nosort>No Sort</d2l-table-col-sort-button></th>
		</tr>
	`;
}
function createFruitHeaderRows(opts) {
	const { selectable, headerAttribute, stickyAttribute, stickyClass, trClass } = { selectable: false, headerAttribute: false, stickyAttribute: false, ...opts };
	return html`
		<tr class="${ifDefined(trClass)}" ?header="${headerAttribute}">
			${selectable ? html`<th rowspan="2" style="width: 1%" class="top"><input type="checkbox"></th>` : nothing}
			<th class="${ifDefined(!selectable ? 'top' : stickyClass)}" ?sticky="${stickyAttribute}" rowspan="2">Country</th>
			<th colspan="5">Fruit Production (tons)</th>
		</tr>
		<tr class="${ifDefined(trClass)}" ?header="${headerAttribute}">
			<th>Apples</th>
			<th>Oranges</th>
			<th>Bananas</th>
			<th>Peaches</th>
			<th>Grapes</th>
		</tr>
	`;
}

function createRows(keys, opts) {
	const { selected } = { selected: false, ...opts };
	return html`${keys.map(key => html`
		<tr ?selected="${selected}">
			<td>${`Cell ${key}-A`}</td>
			<td>${`Cell ${key}-B`}</td>
			<td>${`Cell ${key}-C`}</td>
		</tr>
	`)}`;
}
function createFruitRows(opts) {
	const { inputNumber, selectable, selected, stickyAttribute, stickyClass } = { inputNumber: true, selectable: false, selected: [false, false, false], stickyAttribute: false, ...opts };
	return html`
		<tr ?selected="${selectable && selected[0]}">
			${selectable ? html`<td class="down"><input type="checkbox" ?checked="${selected[0]}"></td>` : nothing}
			<th class="${ifDefined(!selectable ? 'down' : stickyClass)}" ?sticky="${stickyAttribute}">Canada</th>
			<td>356,863</td>
			<td>0</td>
			<th>0</th>
			<td>23,239</td>
			<td class="over">90,911</td>
		</tr>
		<tr ?selected="${selectable && selected[1]}">
			${selectable ? html`<td><input type="checkbox" ?checked="${selected[1]}"></td>` : nothing}
			<th class="${ifDefined(stickyClass)}" ?sticky="${stickyAttribute}">Australia</th>
			${stickyAttribute || stickyClass ? html`<td><d2l-input-number label="label" label-hidden value="308298"></d2l-input-number></td>` : html`<td>308,298</td>`}
			<td>398,610</td>
			<td>${inputNumber ? html`<d2l-input-number label="label" label-hidden value="354241"></d2l-input-number>` : '354,241'}</td>
			<td>80,807</td>
			<td>1,772,911</td>
		</tr>
		<tr ?selected="${selectable && selected[2]}">
			${selectable ? html`<td><input type="checkbox" ?checked="${selected[2]}"></td>` : nothing}
			<th class="${ifDefined(stickyClass)}" ?sticky="${stickyAttribute}">Mexico</th>
			<td>716,931</td>
			<td>4,603,253</td>
			<td>2,384,778</td>
			<td>176,909</td>
			<td>351,310</td>
		</tr>
	`;
}

describe('table', () => {

	[
		{ type: 'default', rtl: false  },
		{ type: 'default', rtl: true  },
		{ type: 'light', rtl: false  },
		{ type: 'light', rtl: true }
	].forEach(({ type, rtl }) => {
		describe(`${rtl ? 'rtl' : 'ltr'}-${type}`, () => {
			async function createTableFixture(tableContents, opts = {}) {
				const tag = defineCE(
					class extends LitElement {
						static get styles() { return [tableStyles]; }
						render() {
							const wrapper = html`
								<d2l-table-wrapper
									?no-column-border="${opts.noColumnBorder}"
									?sticky-headers="${opts.stickyHeaders}"
									style="--d2l-input-position: static;"
									type="${type}">
									${ opts.noTable ? tableContents : html`
										<table class="d2l-table" ?no-column-border="${opts.legacyNoColumnBorder}">${tableContents}</table>
									`}
								</d2l-table-wrapper>`;
							if (!opts.bottomMargin) return wrapper;
							return html`<div style="margin-bottom: 1000px;">${wrapper}</div>`;
						}
					}
				);
				return fixture(`<${tag}></${tag}>`,
					{ rtl, viewport: opts?.viewport || { width: 500 } }
				);
			}

			describe('nonstick', () => {
				it('standard-thead', async() => {
					const elem = await createTableFixture(html`
						<thead>${createHeaderRow()}</thead>
						<tbody>${createRows([1, 2, 3])}</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('standard-no-thead-class', async() => {
					const elem = await createTableFixture(html`
						<tbody>
							${createHeaderRow({ trClass: 'd2l-table-header' })}
							${createRows([1, 2, 3])}
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('standard-no-thead-attr', async() => {
					const elem = await createTableFixture(html`
						<tbody>
							${createHeaderRow({ headerAttribute: true })}
							${createRows([1, 2, 3])}
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('vertical-align', async() => {
					const elem = await createTableFixture(html`
						<thead>
							<tr>
								<th>Header A</th>
								<th>Header B<br>line 2</th>
								<th>Header C</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Cell 1-A</td>
								<td>Cell 1-B<br>line 2</td>
								<td>Cell 1-C</td>
							</tr>
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('empty', async() => {
					const elem = await createTableFixture(html`
						<thead>
							<tr>
								<th></th>
								<th></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('one-column', async() => {
					const elem = await createTableFixture(html`
						<thead>
							<tr><th>Header A</th></tr>
						</thead>
						<tbody>
							<tr><td>Cell 1-A</td></tr>
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('one-cell', async() => {
					const elem = await createTableFixture(html`
						<tbody>
							<tr><td>Cell 1-A</td></tr>
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('no-header-tbody', async() => {
					const elem = await createTableFixture(html`
						<tbody>${createRows([1, 2])}</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('no-header-no-tbody', async() => {
					// Nested Lit expressions break browser's ability to automatically add a tbody
					const elem = await createTableFixture(html`
						<table class="d2l-table">
							<tr>
								<td>Cell 1-A</td>
								<td>Cell 1-B</td>
								<td>Cell 1-C</td>
							</tr>
							<tr>
								<td>Cell 2-A</td>
								<td>Cell 2-B</td>
								<td>Cell 2-C</td>
							</tr>
						</table>
					`, { noTable: true });
					await expect(elem).to.be.golden();
				});

				it('rowspan', async() => {
					const elem = await createTableFixture(html`
						<thead>
							<tr>
								<th rowspan="2">Country</th>
								<th colspan="3">Fruit</th>
							</tr>
							<tr>
								<th>Apples</th>
								<th>Bananas</th>
								<th>Pears</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th>Canada</th>
								<td>$1.29</td>
								<td>$0.79</td>
								<td>$2.41</td>
							</tr>
							<tr>
								<th>Mexico</th>
								<td>$0.59</td>
								<td>$0.38</td>
								<td>$1.99</td>
							</tr>
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('footer', async() => {
					const elem = await createTableFixture(html`
						<thead>${createHeaderRow()}</thead>
						<tbody>${createRows([1])}</tbody>
						<tfoot>
							<tr>
								<td>Footer 1-A</td>
								<td>Footer 1-B</td>
								<td>Footer 1-C</td>
							</tr>
						</tfoot>
					`);
					await expect(elem).to.be.golden();
				});

				it('selected-one-row', async() => {
					const elem = await createTableFixture(html`
						<thead>${createHeaderRow()}</thead>
						<tbody>
							${createRows([1])}
							${createRows([2], { selected: true })}
							${createRows([3])}
						</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('selected-top-bottom', async() => {
					const elem = await createTableFixture(html`
						<thead>${createHeaderRow()}</thead>
						<tbody>
							${createRows([1], { selected: true })}
							${createRows([2])}
							${createRows([3], { selected: true })}
						</tbody>		
					`);
					await expect(elem).to.be.golden();
				});

				it('selected-all', async() => {
					const elem = await createTableFixture(html`
						<thead>${createHeaderRow()}</thead>
						<tbody>${createRows([1, 2, 3], { selected: true })}</tbody>	
					`);
					await expect(elem).to.be.golden();
				});

				it('overflow', async() => {
					const elem = await createTableFixture(html`
						<thead>${createFruitHeaderRows({ selectable: true })}</thead>
						<tbody>${createFruitRows({ inputNumber: false, selectable: true, selected: [false, true, false] })}</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('no-column-border', async() => {
					const elem = await createTableFixture(html`
						<thead>${createHeaderRow()}</thead>
						<tbody>${createRows([1, 2, 3])}</tbody>	
					`, { noColumnBorder: true });
					await expect(elem).to.be.golden();
				});

				it('no-column-border-legacy', async() => {
					const elem = await createTableFixture(html`
						<thead>${createHeaderRow()}</thead>
						<tbody>${createRows([1, 2, 3])}</tbody>	
					`, { legacyNoColumnBorder: true });
					await expect(elem).to.be.golden();
				});

				it('col-sort-button', async() => {
					const elem = await createTableFixture(html`
						<thead>${createSortableHeaderRow()}</thead>
						<tbody>${createRows([1])}</tbody>
					`);
					await expect(elem).to.be.golden();
				});

				it('col-sort-button-focus', async() => {
					const elem = await createTableFixture(html`
						<thead>${createSortableHeaderRow()}</thead>
						<tbody>${createRows([1])}</tbody>
					`);
					await focusElem(elem.shadowRoot.querySelector('d2l-table-col-sort-button'));
					await expect(elem).to.be.golden();
				});
			});

			describe('table-controls', () => {
				[
					{ name: 'no-sticky', stickyControls: false, stickyHeaders: false, visibleBackground: false },
					{ name: 'sticky-controls', stickyControls: true, stickyHeaders: false, visibleBackground: false },
					{ name: 'all-sticky', stickyControls: true, stickyHeaders: true, visibleBackground: false },
					{ name: 'visible-background', stickyControls: true, stickyHeaders: true, visibleBackground: true },
				].forEach(condition1 => {

					describe(condition1.name, () => {
						[
							{ name: '1-top', scroll: 0 },
							{ name: '2-scrolled', scroll: 1000 },
						].forEach(condition2 => {
							it(condition2.name, async() => {
								const elem = await fixture(
									html`
										<div style="height: 300px; overflow-y: scroll;">
											<d2l-test-table
												condensed
												?sticky-controls="${condition1.stickyControls}"
												?sticky-headers="${condition1.stickyHeaders}"
												type="${type}"
												?visible-background="${condition1.visibleBackground}">
											</d2l-test-table>
										</div>
									`,
									{ rtl, viewport: { width: 500 } }
								);
								elem.scrollTo(0, condition2.scroll);
								await nextFrame();
								await expect(elem).to.be.golden();
							});
						});
					});
				});
			});

			describe('paging', () => {
				it('table-with-paging', async() => {
					const elem = await fixture(
						html`<d2l-test-table condensed type="${type}" paging></d2l-test-table>`,
						{ rtl, viewport: { width: 500 } }
					);
					await expect(elem).to.be.golden();
				});
			});
		});
	});
});
