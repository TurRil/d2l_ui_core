import { focusWithKeyboard, focusWithMouse, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-button-icon', () => {

	const visualDiff = new VisualDiff('button-icon', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-icon.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ category: 'normal', tests: ['normal', 'hover', 'focus', 'click', 'disabled'] },
		{ category: 'translucent-enabled', tests: ['normal', 'hover', 'focus', 'click'] },
		{ category: 'translucent-disabled', tests: ['normal', 'hover'] },
		{ category: 'dark', tests: ['normal', 'hover', 'focus', 'click'] },
		{ category: 'dark-disabled', tests: ['normal', 'hover'] },
		{ category: 'custom', tests: ['normal', 'hover', 'focus', 'click'] }
	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {
					const selector = `#${entry.category}`;

					if (name === 'hover') await page.hover(selector);
					else if (name === 'focus') await focusWithKeyboard(page, selector);
					else if (name === 'click') await focusWithMouse(page, selector);

					const rectId = (name.indexOf('disabled') !== -1) ? name : entry.category;
					const rect = await visualDiff.getRect(page, `#${rectId}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
