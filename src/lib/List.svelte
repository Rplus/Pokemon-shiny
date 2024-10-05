<script>
	import { _, } from 'svelte-i18n';
	import { handle_pms, } from '@lib/pm.js';
	import { get_pm_img_src, get_name, set_item, get_item, rev_sort_by, } from '@lib/u.js';
	// import '@lib/check_new_pm.js';
	import { SvelteMap } from 'svelte/reactivity';

	import Item from '@lib/Item.svelte';

	let { init_info = {}, } = $props();

	let log = $state(get_item('log') || []);

	let current_info = $state(init_info);

	if (!current_info.status) {
		current_info = log[0] || {
			name: '',
			status: '',
		};
	}
	// console.log(33, log);

	let {
		pms,
		groups,
		// index_map,
		status_map,
	} = handle_pms(current_info.status);
	// console.log({index_map,status_map});

	let pms_status = $state(status_map);
	console.log({pms_status});

	let status_counter = $derived.by(() => {
		let _counts = [0, 0, 0, 0];
		let _status = pms_status.map(s => {
			if (s || s === 0) {
				_counts[s] += 1;
			}
			return s || 0;
		}).join('');

		return {
			string: _status,
			counts: _counts,
		};
	});

	let current_name = $state(current_info.name || 'name');

	function handle_click_pm(index) {
		pms_status[index] = (pms_status[index] + 1) % 4;
	}

	function save_log() {
		console.log({current_name});
		let index = find_log_index_by_name(current_name);
		console.log({log});
		if (index === -1) {
			index = log.length;
		}
		console.log('status_counter.string', status_counter.string.length);
		console.log(222, pms_status.length);
		log[index] = {
			name: current_name,
			status: status_counter.string,
			time: +new Date(),
		};
		log.sort(rev_sort_by('time'));
		console.log('1111', log);
		set_item('log', log);
	}

	function find_log_index_by_name(name = '') {
		console.log('log.length', log.length);
		return log.length ? log.findIndex(i => i.name === name) : -1;
	}

	function switch_log(e, name) {
		e.preventDefault();
		let index = find_log_index_by_name(name);
		console.log({log, index});
		if (index === -1) {
			return;
		}
		current_name = log[index].name;
		overwrite_status(log[index].status.split(''));
		update_log_time(index);
		// pms_status = log[index].status.split('');
	}

	function update_log_time(index = 0) {
		log[index].time = +new Date();
		log.sort(rev_sort_by('time'));
	}

	function overwrite_status(new_status = []) {
		let new_len = new_status.length;
		let current_len = pms_status.length;
		console.log({new_len, current_len});
		if (new_len < current_len) {
			// pms_status = new_status.concat(pms_status.slice(new_len));
		} else {
			// pms_status = new_status;
		}
	}

	function delete_log(name = '') {
		let index = find_log_index_by_name(name);
		if (index === -1) {
			return;
		}
	}

	class Log {
		log = $state(get_item('log') || []);

		remove(idnex = 0) {
		}

		update(index = 0) {
		}
	}
	const xlog = new Log();
	xlog.update
</script>


<hr>

<header>
	<details>
		<summary>
			counter: {status_counter.counts}
		</summary>
		<div class="word-break:break-all">
			{status_counter.string}
		</div>
	</details>
	name:<div class="name" contenteditable bind:textContent={current_name}></div>
</header>

<hr>

<section>
	history
	{#each log as record}
		<li class={record.name === current_name ? 'font-weight:900' : ''}>
			<a onclick={(e) => switch_log(e, record.name)} href="./?name={record.name}&pms={record.status}">{record.name}</a>
		</li>
	{/each}
	<hr>
	<button onclick={save_log}>Save</button>
</section>

<hr>

<div class="pm-list display:flex flex-wrap:wrap gap:2em place-content:center">
	{#each groups as group, index}
		<div class="pm-group position:relative display:flex flex-wrap:wrap place-content:center">
			<!--
			<div class="position:absolute color:#0003">
				{group.label}
			</div>
			-->

			{#each group.pms as pm}
				<Item {pm} status={pms_status[pm.index]} {handle_click_pm} />
			{/each}

		</div>
	{/each}
</div>


<style>
	.pm-group:not(:has(.pm.status-1, .pm.status-2, .pm.status-3)) {
		opacity: 0.3;
	}
</style>