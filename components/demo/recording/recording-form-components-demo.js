// Form container
import '../../form/form.js';

// Form controls
import '../../inputs/input-checkbox-group.js';
import '../../inputs/input-checkbox.js';
import '../../inputs/input-date.js';
import '../../inputs/input-group.js';
import '../../inputs/input-radio-group.js';
import '../../inputs/input-radio.js';
import '../../inputs/input-text.js';
import '../../inputs/input-textarea.js';

// Actions
import '../../button/button.js';

import { css, html, LitElement } from 'lit';

class RecordingFormComponentsDemo extends LitElement {

	static styles = css`
		:host {
			display: block;
		}
		.actions {
			display: flex;
			gap: 0.5rem;
			margin-top: 1rem;
		}
	`;

	render() {
		return html`
			<!-- Example form demonstrates the requested inputs using existing components. -->
			<d2l-form id="example-form" @d2l-form-submit=${this._handleSubmit}>
				<d2l-input-group>
					<d2l-input-checkbox-group label="Notifications">
						<d2l-input-checkbox label="Enable recording reminders" checked></d2l-input-checkbox>
					</d2l-input-checkbox-group>

					<d2l-input-radio-group label="Recording Type" name="recording-type" required>
						<d2l-input-radio label="Live" value="live" checked></d2l-input-radio>
						<d2l-input-radio label="Pre-recorded" value="pre-recorded"></d2l-input-radio>
					</d2l-input-radio-group>

					<d2l-input-text label="Title" name="title" required></d2l-input-text>
					<d2l-input-textarea label="Description" name="description" required></d2l-input-textarea>
					<d2l-input-date label="Recording Date" name="recording-date" required></d2l-input-date>
				</d2l-input-group>

				<div class="actions">
					<d2l-button primary @click=${this._submitForm}>Submit</d2l-button>
					<d2l-button @click=${this._clearForm}>Clear</d2l-button>
				</div>
			</d2l-form>
		`;
	}

	_clearForm() {
		const form = this.shadowRoot.querySelector('#example-form');
		if (!form) return;
		if (form.reset) form.reset();
		if (form.resetValidation) form.resetValidation();
	}

	_handleSubmit(e) {
		e.preventDefault();
	}

	_submitForm() {
		const form = this.shadowRoot.querySelector('#example-form');
		if (form) form.submit();
	}

}

customElements.define('d2l-recording-form-components-demo', RecordingFormComponentsDemo);
