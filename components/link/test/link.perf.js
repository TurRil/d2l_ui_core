import '../link.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-link', () => {

	it('normal', async() => {
		const element = html`<d2l-link href="d2l.com">link</d2l-link>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});

});
