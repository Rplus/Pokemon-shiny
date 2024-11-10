import {
	rev_sort_by,
	// set_item,
	// get_item,
	set_all_records,
	get_all_records,
} from '@lib/u.js';

export const recorder = await create_recorder();

async function create_recorder() {
	let old_records = await get_all_records();
	// console.log(31, {old_records});
	let records = $state(old_records);

	function find_index_by_name(name = '') {
		return records.findIndex(i => i.name === name);
	}

	function sort_by_time() {
		records.sort(rev_sort_by('time'));
	}

	function add({name, status}) {
		let index = find_index_by_name(name);
		if (index === -1) {
			index = records.length;
		}

		records[index] = {
			name,
			status,
			time: +new Date(),
		};
		sort_by_time();
		save();
	}

	function remove(index = 0) {
		let cheked = confirm(`【${records[index].name}】 will be deleted. \nAre you sure want to *DELETE* this record?`)
		if (!cheked) { return; }
		records.splice(index, 1);
		save();
	}

	function save() {
		set_all_records($state.snapshot(records));
	}

	function renew(index = 0) {
		records[index].time = +new Date();
		sort_by_time();
	}

	function set(data) {
		records = data;
	}

	function reset(argument) {
		let cheked = confirm('Are you sure to *DELETE* ALL records?')
		if (!cheked) { return; }
		set([])
		save();
	}

	return {
		get records() {
			return records;
		},
		add,
		renew,
		set,
		save,
		reset,
		remove,
	};
}
