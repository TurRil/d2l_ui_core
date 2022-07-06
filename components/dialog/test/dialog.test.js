import '../dialog.js';
import { expect, fixture, oneEvent } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-dialog', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-dialog');
		});

	});

	describe('focus management', () => {

		it('should focus on close button if no focusable elements inside', async() => {
			const el = await fixture(html`<d2l-dialog opened>not focusable</d2l-dialog>`);
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement().getAttribute('aria-label')).to.equal('Close this dialog');
		});

		it.skip('should focus on first element when opened initially', async() => {
			const el = await fixture(html`<d2l-dialog opened><button>focus</button></d2l-dialog>`);
			const button = el.querySelector('button');
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement()).to.equal(button);
		});

		it.skip('should focus on first element when opened later', async() => {
			const el = await fixture(html`<d2l-dialog><button>focus</button></d2l-dialog>`);
			const button = el.querySelector('button');
			setTimeout(() => el.opened = true);
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement()).to.equal(button);
		});

		it.skip('should focus on an autofocus element', async() => {
			const el = await fixture(html`<d2l-dialog opened><p autofocus tabindex="-1">focus</p><button>focus</button></d2l-dialog>`);
			const paragraph = el.querySelector('p');
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement()).to.equal(paragraph);
		});

		it.skip('should focus on a descendant autofocus element', async() => {
			const el = await fixture(html`<d2l-dialog opened><div><p autofocus tabindex="-1">focus</p></div><button>focus</button></d2l-dialog>`);
			const paragraph = el.querySelector('p');
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement()).to.equal(paragraph);
		});

		it('should not focus on an autofocus element that had not been made focusable', async() => {
			const el = await fixture(html`<d2l-dialog opened><p autofocus>focus</p><button>focus</button></d2l-dialog>`);
			const paragraph = el.querySelector('p');
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement()).to.not.equal(paragraph);
		});

		it('should not focus on a descendant autofocus element that had not been made focusable', async() => {
			const el = await fixture(html`<d2l-dialog opened><div><p autofocus>focus</p></div><button>focus</button></d2l-dialog>`);
			const paragraph = el.querySelector('p');
			await oneEvent(el, 'd2l-dialog-open');
			expect(getComposedActiveElement()).to.not.equal(paragraph);
		});

	});

});
