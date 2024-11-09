<script>
	import {
		get_name,
		rev_sort_by,
		get_pm_img_src,
		set_item,
		get_item,
		set_all_record,
		get_all_record,
	} from '@lib/u.js';

	let { ori_log = []} = $props();

	let log = $state(ori_log);

	function find_index(name = '') {
		return log.findIndex(i => i.name === name);
	}

	function find(name = '') {
		return log.find(i => i.name === name);
	}

	function set(data) {
		log = data;
	}

	function sort() {
		log.sort(rev_sort_by('time'));
	}

	function renew(index = 0) {
		log[index].time = +new Date();
		sort();
	}

	function add({name, status} = data) {
		let index = find_index(name);
		if (index === -1) {
			console.log('gg');
			index = log.length;
		}
		log[index] = {
			name,
			status,
			time: +new Date(),
		};
		sort();
		save();
	}

	function remove(index = 0) {
		log.splice(index, 1);
		save();
	}

	function save() {
		set_all_record($state.snapshot(log));
	}

	function reset() {
		let cheked = confirm('It will *DELETE* current record, are you sure?')
		if (!cheked) { return; }
		log = [];
		save();
	}
</script>
