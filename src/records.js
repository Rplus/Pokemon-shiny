import { writable } from 'svelte/store';
import {
	rev_sort_by,
	set_item,
	get_item,
	set_all_record,
	get_all_record,
} from '@lib/u.js';

export const records = $state([]);


export const add_record = ({name, status} = new_record) => {
	let index = records.find_index(name);

	if (index === -1) {
		console.log('new one');
		index = records.length;
	}
	records[index] = {
		name,
		status,
		time: +new Date(),
	};
	srot();

	records.update((old_records) => [...old_records, ])
}

function sort() {
	records.sort(rev_sort_by('time'));
}

