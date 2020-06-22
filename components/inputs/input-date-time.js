import './input-date.js';
import './input-fieldset.js';
import './input-time.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getLocalDateTimeFromUTCDateTime, getUTCDateTimeFromLocalDateTime } from '../../helpers/dateTime.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A component that consists of a "<d2l-input-date>" and a "<d2l-input-time>" component. The time input only appears once a date is selected. This component displays the "value" if one is specified, and reflects the selected value when one is selected or entered.
 * @fires change - Dispatched when there is a change in selected date or selected time. "value" reflects the selected value and is in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ").
 */
class InputDateTime extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the input
			 */
			disabled: { type: Boolean },
			/**
			 * Accessible label for the input (REQUIRED)
			 */
			label: { type: String },
			/**
			 * Value of the input. This should be in ISO 8601 combined date and time format ("YYYY-MM-DDTHH:mm:ss.sssZ") and in UTC time (i.e., do NOT localize to the user's timezone).
			 */
			value: { type: String },
			_parsedDateTime: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				white-space: nowrap;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-input-date {
				padding-right: 0.3rem;
			}
			:host([dir="rtl"]) d2l-input-date {
				padding-right: 0;
				padding-left: 0.3rem;
			}
		`;
	}

	constructor() {
		super();
		this.disabled = false;
		this._parsedDateTime = '';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.label) {
			console.warn('d2l-input-date-time component requires label text');
		}
	}

	render() {
		const timeHidden = !this._parsedDateTime;
		return html`
			<d2l-input-fieldset label="${ifDefined(this.label)}">
				<d2l-input-date
					@change="${this._handleDateChange}"
					?disabled="${this.disabled}"
					label="${this.localize('components.input-date-time.date')}"
					label-hidden
					.value="${this._parsedDateTime}">
				</d2l-input-date>
				<d2l-input-time
					@change="${this._handleTimeChange}"
					?disabled="${this.disabled}"
					?hidden="${timeHidden}"
					label="${this.localize('components.input-date-time.time')}"
					label-hidden
					max-height="430"
					.value="${this._parsedDateTime}">
				</d2l-input-time>
			</d2l-input-fieldset>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'value') {
				try {
					this._parsedDateTime = getLocalDateTimeFromUTCDateTime(this.value);
				} catch (e) {
					// set value to empty if invalid value
					this.value = '';
					this._parsedDateTime = '';
				}
			}
		});
	}

	focus() {
		const elem = this.shadowRoot.querySelector('d2l-input-date');
		if (elem) elem.focus();
	}

	_dispatchChangeEvent() {
		this.dispatchEvent(new CustomEvent(
			'change',
			{ bubbles: true, composed: false }
		));
	}

	_handleDateChange(e) {
		const newDate = e.target.value;
		if (!newDate) {
			this.value = '';
		} else {
			const time = this.shadowRoot.querySelector('d2l-input-time').value;
			this.value = getUTCDateTimeFromLocalDateTime(newDate, time);
		}
		this._dispatchChangeEvent();
	}

	_handleTimeChange(e) {
		this.value = getUTCDateTimeFromLocalDateTime(this._parsedDateTime, e.target.value);
		this._dispatchChangeEvent();
	}

}
customElements.define('d2l-input-date-time', InputDateTime);
