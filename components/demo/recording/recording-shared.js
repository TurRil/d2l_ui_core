export const recordings = [
	{
		id: 1,
		title: 'Quarterly Product Update',
		thumbnail: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg',
		date: '2026-08-10',
		presenter: 'Avery Nguyen',
		status: 'Scheduled',
		playbackUrl: '/recordings/1',
		downloads: [
			{ label: 'Video (MP4)', url: '/recordings/1/download/video' },
			{ label: 'Audio (MP3)', url: '/recordings/1/download/audio' },
			{ label: 'Transcript (TXT)', url: '/recordings/1/download/transcript' }
		]
	},
	{
		id: 2,
		title: 'Onboarding Walkthrough',
		thumbnail: 'https://s.brightspace.com/course-images/images/e5fd575a-bc14-4a80-89e1-46f349a76178/tile-low-density-max-size.jpg',
		date: '2026-08-08',
		presenter: 'Jordan Patel',
		status: 'Processing',
		playbackUrl: '/recordings/2',
		downloads: [
			{ label: 'Video (MP4)', url: '/recordings/2/download/video' },
			{ label: 'Audio (MP3)', url: '/recordings/2/download/audio' }
		]
	},
	{
		id: 3,
		title: 'Accessibility Review Session',
		thumbnail: 'https://s.brightspace.com/course-images/images/63b162ab-b582-4bf9-8c1d-1dad04714121/tile-low-density-max-size.jpg',
		date: '2026-08-03',
		presenter: 'Taylor Brooks',
		status: 'Published',
		playbackUrl: '/recordings/3',
		downloads: [
			{ label: 'Video (MP4)', url: '/recordings/3/download/video' },
			{ label: 'Audio (MP3)', url: '/recordings/3/download/audio' },
			{ label: 'Slides (PDF)', url: '/recordings/3/download/slides' }
		]
	},
	{
		id: 4,
		title: 'Curriculum Committee Meeting',
		thumbnail: 'https://s.brightspace.com/course-images/images/e4fbb461-4cd9-4512-8304-44f2c2b741f1/tile-low-density-max-size.jpg',
		date: '2026-07-28',
		presenter: 'Morgan Silva',
		status: 'Awaiting Review',
		playbackUrl: '/recordings/4',
		downloads: [
			{ label: 'Video (MP4)', url: '/recordings/4/download/video' },
			{ label: 'Audio (MP3)', url: '/recordings/4/download/audio' }
		]
	},
	{
		id: 5,
		title: 'Pilot Recording - Segment B',
		thumbnail: 'https://s.brightspace.com/course-images/images/38e839b1-37fa-470c-8830-b189ce4ae134/tile-high-density-max-size.jpg',
		date: '2026-07-19',
		presenter: 'Casey Lin',
		status: 'Unwanted',
		playbackUrl: '/recordings/5',
		downloads: [
			{ label: 'Video (MP4)', url: '/recordings/5/download/video' }
		]
	},
	{
		id: 6,
		title: 'Monthly Team Sync',
		thumbnail: 'https://s.brightspace.com/course-images/images/e5fd575a-bc14-4a80-89e1-46f349a76178/tile-low-density-max-size.jpg',
		date: '2026-07-12',
		presenter: 'Riley Kaur',
		status: 'Failed',
		playbackUrl: '/recordings/6',
		downloads: [
			{ label: 'Log Bundle (ZIP)', url: '/recordings/6/download/logs' }
		]
	}
];

const statusStateMap = {
	'Scheduled': 'default',
	'Processing': 'default',
	'Published': 'success',
	'Awaiting Review': 'default',
	'Unwanted': 'none',
	'Failed': 'alert'
};

const formatter = new Intl.DateTimeFormat('en-CA', {
	dateStyle: 'medium'
});

export const sortComparators = {
	date: (a, b) => new Date(a.date) - new Date(b.date),
	presenter: (a, b) => a.presenter.localeCompare(b.presenter),
	status: (a, b) => a.status.localeCompare(b.status),
	title: (a, b) => a.title.localeCompare(b.title)
};

export function cloneRecordings() {
	return recordings.map(recording => ({
		...recording,
		downloads: recording.downloads.map(download => ({ ...download }))
	}));
}

export function formatRecordingDate(date) {
	return formatter.format(new Date(date));
}

export function getStatusIndicatorState(status) {
	return statusStateMap[status] || 'none';
}
