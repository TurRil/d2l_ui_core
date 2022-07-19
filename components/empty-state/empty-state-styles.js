import '../colors/colors.js';
import { css } from 'lit';

export const emptyStateStyles = css`

	:host {
		border: 1px solid var(--d2l-color-mica);
		border-radius: 0.3rem;
		display: block;
		padding: 1.2rem 1.5rem;
	}

	:host([hidden]) {
		display: none;
	}

`;

export const emptyStateSimpleStyles = css`

	:host([dir="rtl"]) .d2l-empty-state-description {
		padding-left: 0.5rem;
		padding-right: 0;
	}

	.d2l-empty-state-description {
		display: inline;
		padding-right: 0.5rem;
	}

	.d2l-empty-state-action {
		vertical-align: top;
	}

`;

export const emptyStateIllustratedStyles = css`

	:host {
		text-align: center;
	}

	.d2l-empty-state-action {
		margin-top: 0.5rem;
	}

	.d2l-empty-state-description {
		margin: 0 auto 0.3rem;
		max-width: 500px;
		width: 100%;
	}

	.d2l-empty-state-title {
		margin-bottom: 0.9rem;
	}
	
	.d2l-empty-state-title-large {
		font-size: 1.5rem;
		line-height: 1.8rem;
		margin: 1rem 0 1.5rem 0;
	}

	.d2l-empty-state-title-small {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5rem;
		margin-top: 0.5rem;
	}

	::slotted(*) {
		display: none;
	}

	::slotted(svg:first-child) {
		display: inline-block;
	}

	svg {
		height: 100%;
		max-width: 500px;
		width: 100%;
	}

`;
