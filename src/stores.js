import { writable, derived } from 'svelte/store';
import { recorder, } from '@lib/recorder.svelte.js';

let qs = new URL(location).searchParams;

let init_config = {
	status: '',
	name: '?',
};

if (qs.get('status')) {
	init_config.status = qs.get('status');
	init_config.name = qs.get('name');
} else if (recorder?.records[0]) {
	init_config.status = recorder.records[0].status;
	init_config.name = recorder.records[0].name;
}

// reset location.search to prevent confuse
if (location.search) {
	history.pushState({}, null, './');
}

export const status = writable(init_config.status || '');
export const name = writable(init_config.name || '?');
export const pms = writable([]);

