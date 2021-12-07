import '../input-text.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-input-text', () => {

	it('normal', async() => {
		const element = html`<d2l-input-text label="label"></d2l-input-text>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2000);
	});

	it('slots', async() => {
		const element = html`<d2l-input-text label="label">
				<span slot="left">left</span>
				<span slot="right">right</span>
				<span slot="after">after</span>
			</d2l-input-text>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2000);
	});

	it('unit', async() => {
		const element = html`<d2l-input-text label="label" unit="%"></d2l-input-text>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2000);
	});

});
