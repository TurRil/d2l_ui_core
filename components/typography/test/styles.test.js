import { _isValidCssSelector } from '../styles.js';
import { expect } from '@open-wc/testing';

describe.only('_isValidCssSelector', () => {

	it('should support simple tag names', () => {
		expect(_isValidCssSelector('a')).to.be.true;
		expect(_isValidCssSelector('button')).to.be.true;
		expect(_isValidCssSelector('table')).to.be.true;
		expect(_isValidCssSelector('dl')).to.be.true;
	});

	it('should support simple class selectors', () => {
		expect(_isValidCssSelector('.d2l-label-styles')).to.be.true;
		expect(_isValidCssSelector('.d2l-body-compact')).to.be.true;
		expect(_isValidCssSelector('.className')).to.be.true;
	});

	it('should support simple id selectors', () => {
		expect(_isValidCssSelector('#opener')).to.be.true;
	});

	it('should support simple property selectors', () => {
		expect(_isValidCssSelector('button[loading]')).to.be.true;
		expect(_isValidCssSelector('p[loading]')).to.be.true;
	});

	it('should not support complex selectors', () => {
		expect(_isValidCssSelector('dl dd')).to.be.false;
		expect(_isValidCssSelector('dt.class')).to.be.false;
		expect(_isValidCssSelector('dt#id')).to.be.false;
		expect(_isValidCssSelector('dl .class')).to.be.false;
		expect(_isValidCssSelector('dl #id')).to.be.false;
	});

	it('should not support invalid selectors', () => {
		expect(_isValidCssSelector('a[b[c]]')).to.be.false;
		expect(_isValidCssSelector('abc$')).to.be.false;
		expect(_isValidCssSelector('@')).to.be.false;
		expect(_isValidCssSelector('@import')).to.be.false;
		expect(_isValidCssSelector('@media')).to.be.false;
		expect(_isValidCssSelector('%')).to.be.false;
		expect(_isValidCssSelector('.class-name{display:block}')).to.be.false;
	});
});
