// Buttons + links + icons
import '../components/button/button-icon.js';
import '../components/button/button.js';

// Dialogs
import '../components/dialog/dialog-confirm.js';
import '../components/dialog/dialog-fullscreen.js';
import '../components/dialog/dialog.js';

// Forms
import '../components/form/form.js';

// Input controls
import '../components/inputs/input-date.js';
import '../components/inputs/input-group.js';
import '../components/inputs/input-number.js';
import '../components/inputs/input-search.js';
import '../components/inputs/input-text.js';
import '../components/inputs/input-textarea.js';
import '../components/inputs/input-time.js';

// Link + status
import '../components/link/link.js';
import '../components/status-indicator/status-indicator.js';

// Table
import '../components/table/table-col-sort-button.js';
import '../components/table/table-wrapper.js';

import { cloneRecordings, formatRecordingDate, getStatusIndicatorState, sortComparators } from './recording-shared.js';
import { css, html, LitElement, nothing } from 'lit';

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
		.table-toolbar {
			margin-bottom: 0.75rem;
		}
		.top-actions {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			justify-content: flex-end;
			margin-bottom: 1rem;
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
			<!-- Top-right actions follow existing button and dialog patterns. -->
			<div class="top-actions">
				<d2l-button primary @click=${this._openRecordUrl}>Record</d2l-button>
				<d2l-button @click=${this._openScheduleDialog}>Schedule</d2l-button>
				<d2l-button @click=${this._openTimetableDialog}>Timetable</d2l-button>
				<d2l-button @click=${this._openDetailsDialog}>Details</d2l-button>
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
							<th scope="col"><d2l-table-col-sort-button @click=${this._sortByTitle} ?desc=${this._sortDesc} ?nosort=${this._sortField !== 'title'}>Title</d2l-table-col-sort-button></th>
							<th scope="col"><d2l-table-col-sort-button @click=${this._sortByDate} ?desc=${this._sortDesc} ?nosort=${this._sortField !== 'date'}>Date</d2l-table-col-sort-button></th>
							<th scope="col"><d2l-table-col-sort-button @click=${this._sortByPresenter} ?desc=${this._sortDesc} ?nosort=${this._sortField !== 'presenter'}>Presenter</d2l-table-col-sort-button></th>
							<th scope="col"><d2l-table-col-sort-button @click=${this._sortByStatus} ?desc=${this._sortDesc} ?nosort=${this._sortField !== 'status'}>Status</d2l-table-col-sort-button></th>
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
									<d2l-button-icon data-recording-id="${recording.id}" icon="tier1:edit" text="Edit ${recording.title}" @click=${this._onEditActionClick}></d2l-button-icon>
									<d2l-button-icon data-recording-id="${recording.id}" icon="tier1:delete" text="Delete ${recording.title}" @click=${this._onDeleteActionClick}></d2l-button-icon>
									<d2l-button-icon data-recording-id="${recording.id}" icon="tier1:download" text="Download ${recording.title}" @click=${this._onDownloadActionClick}></d2l-button-icon>
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

	_getRecordingById(id) {
		return this._allRecordings.find(recording => recording.id === id) || null;
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

	_onDeleteActionClick(e) {
		const id = Number(e.currentTarget.getAttribute('data-recording-id'));
		this._editingRecording = this._getRecordingById(id);
		this._openDialog('#delete-dialog');
	}

	_onDownloadActionClick(e) {
		const id = Number(e.currentTarget.getAttribute('data-recording-id'));
		this._activeDownloadRecording = this._getRecordingById(id);
		this._openDialog('#download-dialog');
	}

	_onEditActionClick(e) {
		const id = Number(e.currentTarget.getAttribute('data-recording-id'));
		this._editingRecording = this._getRecordingById(id);
		this._openDialog('#details-dialog');
	}

	_openDetailsDialog() {
		this._editingRecording = null;
		this._openDialog('#details-dialog');
	}

	_openDialog(selector) {
		const dialog = this.shadowRoot.querySelector(selector);
		dialog.opened = true;
	}

	_openRecordUrl() {
		window.open('/recordings/start', '_blank', 'noopener,noreferrer');
	}

	_openScheduleDialog() {
		this._openDialog('#schedule-dialog');
	}

	_openTimetableDialog() {
		this._openDialog('#timetable-dialog');
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
			filtered.sort((a, b) => (this._sortDesc ? comparator(b, a) : comparator(a, b)));
		}

		this._visibleRecordings = filtered;
	}

	_renderDeleteConfirmDialog() {
		return html`
			<d2l-dialog-confirm
				id="delete-dialog"
				title-text="Delete recording"
				text="${this._editingRecording ? `Are you sure you want to delete "${this._editingRecording.title}"?` : 'Are you sure?'}"
				@d2l-dialog-close=${this._handleDeleteDialogClose}>
				<d2l-button slot="footer" primary data-dialog-action="delete">Delete</d2l-button>
				<d2l-button slot="footer" data-dialog-action="cancel">Cancel</d2l-button>
			</d2l-dialog-confirm>
		`;
	}

	_renderDetailsDialog() {
		const presenterValue = this._editingRecording ? this._editingRecording.presenter : '';
		const titleValue = this._editingRecording ? this._editingRecording.title : '';
		return html`
			<!-- Details uses fullscreen dialog to follow full-page editing patterns. -->
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

	_sortByDate() {
		this._toggleSort('date');
	}

	_sortByPresenter() {
		this._toggleSort('presenter');
	}

	_sortByStatus() {
		this._toggleSort('status');
	}

	_sortByTitle() {
		this._toggleSort('title');
	}

	_toggleSort(field) {
		this._sortDesc = this._sortField === field ? !this._sortDesc : false;
		this._sortField = field;
		this._rebuildVisibleRecordings();
	}

}

customElements.define('d2l-recording-management-demo', RecordingManagementDemo);
