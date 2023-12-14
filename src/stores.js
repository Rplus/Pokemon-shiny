import { writable, readable, derived, } from 'svelte/store';
import { fetch_data, } from '@/data.js';
import { saveItem, getItem, sort_by_prop, } from '@/u.js';
import { locale, } from 'svelte-i18n';


export const default_config = {
	order_by: 'group',
	visible_status: [true, true, true, true, ],
	colors: ['#dada0b', '#a1a112'],
	tab: {},
};

export const config = writable({
	...default_config,
	...getItem('config'),
});

config.subscribe(_config => {
	saveItem({
		key: 'config',
		value: _config,
	});
});



const init_urls = getItem('urls') || [];
export const urls = function urls_hanlder() {
	const { subscribe, set, update } = writable(init_urls);
	const sort_by_time = sort_by_prop('time');

	return {
		subscribe,

		add: (new_record) => update(old_records => {
			let index = old_records.findIndex(i => i.title === new_record.title);
			if (index === -1) {
				index = old_records.length;
			}
			old_records[index] = new_record;

			return old_records.sort(sort_by_time);
		}),

		remove: (target) => update(old_records => {
			let index = old_records.findIndex(i => i.title === target.title);
			if (index !== -1) {
				old_records.splice(index, 1);
			}
			return old_records;
		}),

		reset: () => set([]),
	};
}();

urls.subscribe(_urls => {
	saveItem({
		key: 'urls',
		value: _urls,
	});
});

export const default_nickname = 'ID?';
let init_nickname = default_nickname;
let init_status;


// init status & nickname
if (init_urls[0]) {
	init_nickname = init_urls[0].title;
	init_status = init_urls[0].status;
}
// console.log({init_urls, init_status});

export const nickname = writable(init_nickname);

const _data = await fetch_data(init_status);
export const MAX_DEX = _data.MAX_DEX;
export const pms = readable(_data.pms);
export const pms_status = writable(_data.status);
