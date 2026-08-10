// Layout + cards
import '../../card/card.js';
import '../../card/card-content-meta.js';

// Buttons + links + icons
import '../../button/button-icon.js';
import '../../link/link.js';

// Modal/dialog
import '../../dialog/dialog.js';
import '../../button/button.js';

// Table + view switching
import '../../table/table-wrapper.js';
import '../../view-switcher/view-switcher.js';
import '../../view-switcher/view-switcher-button.js';

import { LitElement, css, html } from 'lit';
import { cloneRecordings, formatRecordingDate } from './recording-shared.js';

class RecordingListDemo extends LitElement {

	static properties = {
		_activeDownloadRecording: { state: true },
		_view: { state: true }
	};

	static styles = css`
		:host {
			display: block;
		}
		.recordings-card-grid {
			display: grid;
			gap: 0.75rem;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		}
		d2l-card {
			width: 100%;
		}
		.thumbnail {
			display: block;
			height: 145px;
			object-fit: cover;
			width: 100%;
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
		.view-switcher {
			margin-bottom: 0.75rem;
		}
		.table-actions {
			text-align: center;
			width: 1px;
		}
		.download-links {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	`;

	constructor() {
		super();
		this._activeDownloadRecording = null;
		this._view = 'card';
		this._recordings = cloneRecordings();
	}

	render() {
		return html`
			<!-- Recording list page controls both card and table views on one route. -->
			<d2l-view-switcher class="view-switcher" label="Recording View" @d2l-view-switcher-select=${this._handleViewSelect}>
				<d2l-view-switcher-button key="card" text="Cards" ?selected=${this._view === 'card'}></d2l-view-switcher-button>
				<d2l-view-switcher-button key="table" text="Table" ?selected=${this._view === 'table'}></d2l-view-switcher-button>
			</d2l-view-switcher>

			${this._view === 'card' ? this._renderCards() : this._renderTable()}
			${this._renderDownloadDialog()}
		`;
	}

	_renderCards() {
		return html`
			<div class="recordings-card-grid">
				${this._recordings.map(recording => html`
					<d2l-card text="${recording.title}" href="${recording.playbackUrl}" style="height: 265px;">
						<img
							slot="header"
							alt="Thumbnail preview for ${recording.title}"
							class="thumbnail"
							src="${recording.thumbnail}">
						<d2l-button-icon
							slot="actions"
							icon="tier1:download"
							text="Download ${recording.title}"
							@click=${(e) => this._openDownloadDialog(e, recording)}>
						</d2l-button-icon>
						<div slot="content">
							<div>${recording.title}</div>
							<d2l-card-content-meta>${formatRecordingDate(recording.date)} · ${recording.presenter}</d2l-card-content-meta>
						</div>
					</d2l-card>
				`)}
			</div>
		`;
	}

	_renderDownloadDialog() {
		return html`
			<!-- One shared modal is reused by both card and table actions. -->
			<d2l-dialog id="download-dialog" title-text="${this._activeDownloadRecording ? `Download ${this._activeDownloadRecording.title}` : 'Download Recording'}">
				${this._activeDownloadRecording ? html`
					<div class="download-links">
						${this._activeDownloadRecording.downloads.map(download => html`
							<d2l-link href="${download.url}">${download.label}</d2l-link>
						`)}
					</div>
				` : null}
				<d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
			</d2l-dialog>
		`;
	}

	_renderTable() {
		return html`
			<d2l-table-wrapper>
				<table class="d2l-table">
					<thead>
						<tr>
							<th scope="col">Thumbnail</th>
							<th scope="col">Title</th>
							<th scope="col">Date</th>
							<th scope="col">Presenter</th>
							<th class="table-actions" scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						${this._recordings.map(recording => html`
							<tr>
								<td>
									<d2l-link class="recording-thumbnail-link" href="${recording.playbackUrl}">
										<img alt="Playback thumbnail for ${recording.title}" src="${recording.thumbnail}">
									</d2l-link>
								</td>
								<th scope="row">${recording.title}</th>
								<td>${formatRecordingDate(recording.date)}</td>
								<td>${recording.presenter}</td>
								<td class="table-actions">
									<d2l-button-icon
										icon="tier1:download"
										text="Download ${recording.title}"
										@click=${(e) => this._openDownloadDialog(e, recording)}>
									</d2l-button-icon>
								</td>
							</tr>
						`)}
					</tbody>
				</table>
			</d2l-table-wrapper>
		`;
	}

	_handleViewSelect(e) {
		this._view = e.detail.key;
	}

	_openDownloadDialog(e, recording) {
		e.preventDefault();
		e.stopPropagation();
		this._activeDownloadRecording = recording;
		const dialog = this.shadowRoot.querySelector('#download-dialog');
		dialog.opened = true;
	}

}

customElements.define('d2l-recording-list-demo', RecordingListDemo);
