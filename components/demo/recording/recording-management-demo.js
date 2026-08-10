// Layout + table
import '../../table/table-col-sort-button.js';
import '../../table/table-wrapper.js';

// Buttons + links + icons
import '../../button/button.js';
import '../../button/button-icon.js';
import '../../link/link.js';

// Status + search
import '../../inputs/input-search.js';
import '../../status-indicator/status-indicator.js';

// Forms
import '../../form/form.js';
import '../../inputs/input-date.js';
import '../../inputs/input-group.js';
import '../../inputs/input-number.js';
import '../../inputs/input-text.js';
import '../../inputs/input-textarea.js';
import '../../inputs/input-time.js';

// Dialogs
import '../../dialog/dialog.js';
import '../../dialog/dialog-confirm.js';
import '../../dialog/dialog-fullscreen.js';

import { LitElement, css, html, nothing } from 'lit';
import { cloneRecordings, formatRecordingDate, getStatusIndicatorState, sortComparators } from './recording-shared.js';

class RecordingManagementDemo extends LitElement {

	static properties = {
		_activeDownloadRecording: { state: true },
		_editingRecording: { state: true },
		_searchValue: { state: true },
		_sortDesc: { state: true },
		_sortField: { state: true },
		_visibleRecordings: { state: true }
	};

	static styles = css`
		:host {
			display: block;
		}
		.top-actions {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			justify-content: flex-end;
			margin-bottom: 1rem;
		}
		.table-toolbar {
			margin-bottom: 0.75rem;
		}
		.recording-thumbnail-link {
			display: inline-block;
		}
		.recording-thumbnail-link img {
			border-radius: 4px;
			display: block;
			height: 40px;
			object-fit: cover;
			width: 70px;
		}
		.actions {
			white-space: nowrap;
			width: 1px;
		}
		.actions d2l-button-icon + d2l-button-icon {
			margin-left: 0.25rem;
		}
		.dialog-form {
			display: block;
		}
		.download-links {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	`;

	constructor() {
		super();
		this._allRecordings = cloneRecordings();
		this._activeDownloadRecording = null;
		this._editingRecording = null;
		this._searchValue = '';
		this._sortDesc = false;
		this._sortField = 'date';
		this._visibleRecordings = [];
		this._rebuildVisibleRecordings();
	}

	render() {
		return html`
			<!-- Top-right actions match existing button patterns and open existing dialogs. -->
			<div class="top-actions">
				<d2l-button primary @click=${this._openRecordUrl}>Record</d2l-button>
				<d2l-button @click=${() => this._openDialog('#schedule-dialog')}>Schedule</d2l-button>
				<d2l-button @click=${() => this._openDialog('#timetable-dialog')}>Timetable</d2l-button>
				<d2l-button @click=${() => this._openDialog('#details-dialog')}>Details</d2l-button>
			</div>

			<div class="table-toolbar">
				<d2l-input-search
					label="Search recordings"
					placeholder="Search by title, presenter, or status"
					value="${this._searchValue}"
					@d2l-input-search-searched=${this._handleSearch}>
				</d2l-input-search>
			</div>

			<d2l-table-wrapper>
				<table class="d2l-table">
					<thead>
						<tr>
							<th scope="col">Thumbnail</th>
							<th scope="col">${this._renderSortButton('title', 'Title')}</th>
							<th scope="col">${this._renderSortButton('date', 'Date')}</th>
							<th scope="col">${this._renderSortButton('presenter', 'Presenter')}</th>
							<th scope="col">${this._renderSortButton('status', 'Status')}</th>
							<th class="actions" scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						${this._visibleRecordings.map(recording => html`
							<tr>
								<td>
									<d2l-link class="recording-thumbnail-link" href="${recording.playbackUrl}">
										<img alt="Playback thumbnail for ${recording.title}" src="${recording.thumbnail}">
									</d2l-link>
								</td>
								<th scope="row">${recording.title}</th>
								<td>${formatRecordingDate(recording.date)}</td>
								<td>${recording.presenter}</td>
								<td>
									<d2l-status-indicator
										state="${getStatusIndicatorState(recording.status)}"
										text="${recording.status}">
									</d2l-status-indicator>
								</td>
								<td class="actions">
									<d2l-button-icon icon="tier1:edit" text="Edit ${recording.title}" @click=${() => this._openEdit(recording)}></d2l-button-icon>
									<d2l-button-icon icon="tier1:delete" text="Delete ${recording.title}" @click=${() => this._openDelete(recording)}></d2l-button-icon>
									<d2l-button-icon icon="tier1:download" text="Download ${recording.title}" @click=${() => this._openDownload(recording)}></d2l-button-icon>
								</td>
							</tr>
						`)}
					</tbody>
				</table>
			</d2l-table-wrapper>

			${this._renderDownloadDialog()}
			${this._renderScheduleDialog()}
			${this._renderTimetableDialog()}
			${this._renderDetailsDialog()}
			${this._renderDeleteConfirmDialog()}
		`;
	}

	_renderDeleteConfirmDialog() {
		return html`
			<d2l-dialog-confirm id="delete-dialog" title-text="Delete recording" text="${this._editingRecording ? `Are you sure you want to delete \"${this._editingRecording.title}\"?` : 'Are you sure?'}" @d2l-dialog-close=${this._handleDeleteDialogClose}>
				<d2l-button slot="footer" primary data-dialog-action="delete">Delete</d2l-button>
				<d2l-button slot="footer" data-dialog-action="cancel">Cancel</d2l-button>
			</d2l-dialog-confirm>
		`;
	}

	_renderDetailsDialog() {
		const titleValue = this._editingRecording ? this._editingRecording.title : '';
		const presenterValue = this._editingRecording ? this._editingRecording.presenter : '';
		return html`
			<!-- Details uses fullscreen dialog to follow full-page-editing interaction patterns. -->
			<d2l-dialog-fullscreen id="details-dialog" title-text="Recording Details">
				<d2l-form class="dialog-form">
					<d2l-input-group>
						<d2l-input-text label="Title" value="${titleValue}"></d2l-input-text>
						<d2l-input-text label="Presenter" value="${presenterValue}"></d2l-input-text>
						<d2l-input-date label="Date"></d2l-input-date>
						<d2l-input-textarea label="Description"></d2l-input-textarea>
					</d2l-input-group>
				</d2l-form>
				<d2l-button slot="footer" primary data-dialog-action="save">Save</d2l-button>
				<d2l-button slot="footer" data-dialog-action="cancel">Cancel</d2l-button>
			</d2l-dialog-fullscreen>
		`;
	}

	_renderDownloadDialog() {
		return html`
			<d2l-dialog id="download-dialog" title-text="${this._activeDownloadRecording ? `Download ${this._activeDownloadRecording.title}` : 'Download Recording'}">
				${this._activeDownloadRecording ? html`
					<div class="download-links">
						${this._activeDownloadRecording.downloads.map(download => html`
							<d2l-link href="${download.url}">${download.label}</d2l-link>
						`)}
					</div>
				` : nothing}
				<d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
			</d2l-dialog>
		`;
	}

	_renderScheduleDialog() {
		return html`
			<d2l-dialog id="schedule-dialog" title-text="Schedule Recording">
				<d2l-form class="dialog-form">
					<d2l-input-group>
						<d2l-input-text label="Title" required></d2l-input-text>
						<d2l-input-date label="Date" required></d2l-input-date>
						<d2l-input-time label="Start Time" required></d2l-input-time>
						<d2l-input-number label="Duration (minutes)" min="1" required></d2l-input-number>
						<d2l-input-text label="Location" required></d2l-input-text>
					</d2l-input-group>
				</d2l-form>
				<d2l-button slot="footer" primary data-dialog-action="schedule">Schedule</d2l-button>
				<d2l-button slot="footer" data-dialog-action="cancel">Cancel</d2l-button>
			</d2l-dialog>
		`;
	}

	_renderSortButton(field, text) {
		return html`
			<d2l-table-col-sort-button
				@click=${() => this._toggleSort(field)}
				?desc=${this._sortDesc}
				?nosort=${this._sortField !== field}>${text}</d2l-table-col-sort-button>
		`;
	}

	_renderTimetableDialog() {
		return html`
			<d2l-dialog-fullscreen id="timetable-dialog" title-text="Timetable">
				<d2l-form class="dialog-form">
					<d2l-input-group>
						<d2l-input-text label="Session Name" required></d2l-input-text>
						<d2l-input-date label="Date" required></d2l-input-date>
						<d2l-input-time label="Start Time" required></d2l-input-time>
						<d2l-input-time label="End Time" required></d2l-input-time>
						<d2l-input-textarea label="Notes"></d2l-input-textarea>
					</d2l-input-group>
				</d2l-form>
				<d2l-button slot="footer" primary data-dialog-action="save">Save Timetable</d2l-button>
				<d2l-button slot="footer" data-dialog-action="cancel">Cancel</d2l-button>
			</d2l-dialog-fullscreen>
		`;
	}

	_handleDeleteDialogClose(e) {
		if (e.detail.action !== 'delete' || !this._editingRecording) return;
		this._allRecordings = this._allRecordings.filter(recording => recording.id !== this._editingRecording.id);
		this._editingRecording = null;
		this._rebuildVisibleRecordings();
	}

	_handleSearch(e) {
		this._searchValue = e.detail.value.trim();
		this._rebuildVisibleRecordings();
	}

	_openDelete(recording) {
		this._editingRecording = recording;
		this._openDialog('#delete-dialog');
	}

	_openDialog(selector) {
		const dialog = this.shadowRoot.querySelector(selector);
		dialog.opened = true;
	}

	_openDownload(recording) {
		this._activeDownloadRecording = recording;
		this._openDialog('#download-dialog');
	}

	_openEdit(recording) {
		this._editingRecording = recording;
		this._openDialog('#details-dialog');
	}

	_openRecordUrl() {
		window.open('/recordings/start', '_blank', 'noopener,noreferrer');
	}

	_rebuildVisibleRecordings() {
		const searchValue = this._searchValue.toLowerCase();
		const filtered = this._allRecordings.filter(recording => {
			if (!searchValue) return true;
			return [recording.title, recording.presenter, recording.status]
				.some(value => value.toLowerCase().includes(searchValue));
		});

		const comparator = sortComparators[this._sortField];
		if (comparator) {
			filtered.sort((a, b) => this._sortDesc ? comparator(b, a) : comparator(a, b));
		}

		this._visibleRecordings = filtered;
	}

	_toggleSort(field) {
		this._sortDesc = this._sortField === field ? !this._sortDesc : false;
		this._sortField = field;
		this._rebuildVisibleRecordings();
	}

}

customElements.define('d2l-recording-management-demo', RecordingManagementDemo);
