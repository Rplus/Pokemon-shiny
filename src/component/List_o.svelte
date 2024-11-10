<script>
	import { _, } from 'svelte-i18n';
	import { handle_pms, } from '@lib/pm.js';
	import {
		get_name,
		rev_sort_by,
		get_pm_img_src,
		set_item,
		get_item,
		set_all_record,
		get_all_record,
	} from '@lib/u.js';
	// import '@lib/check_new_pm.js';
	import { SvelteMap } from 'svelte/reactivity';

	import Item from '@lib/Item.svelte';
	// import Record from '@lib/Record.svelte';

	let { init_info = {}, ori_log = []} = $props();

	let current_info = $state(init_info);

	class Record {
		log = $state(ori_log);

		find_index(name = '') {
			return this.log.findIndex(i => i.name === name);
		}

		find(name = '') {
			return this.log.find(i => i.name === name);
		}

		set(data) {
			this.log = data;
		}

		sort() {
			this.log.sort(rev_sort_by('time'));
		}

		renew(index = 0) {
			this.log[index].time = +new Date();
			this.sort();
			this.save();
		}

		add({name, status} = data) {
			let index = this.find_index(name);
			if (index === -1) {
				console.log('gg');
				index = this.log.length;
			}
			this.log[index] = {
				name,
				status,
				time: +new Date(),
			};
			this.sort();
			this.save();
		}

		remove(index = 0) {
			this.log.splice(index, 1);
			this.save();
		}

		save() {
			set_all_record($state.snapshot(this.log));
		}

		reset() {
			let cheked = confirm('It will *DELETE* current record, are you sure?')
			if (!cheked) { return; }
			this.log = [];
			this.save();
		}
	}
	const record_log = new Record();

	if (!current_info.status) {
		current_info = record_log.log[0] || {
			name: '',
			status: '',
		};
	}

	let {
		pms,
		groups,
		// index_map,
		status_map,
	} = handle_pms(current_info.status);
	// console.log({index_map,status_map});

	let pms_status = $state(status_map);
	// console.log({pms_status});

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

	function add_current() {
		record_log.add({
			name: current_name,
			status: status_counter.string,
		})
	}

	function apply_link(e, index, url) {
		e.preventDefault();
		record_log.renew(index);
		location.href = url;
		// console.log({url});
	}

	export function save_record() {
		record_log.save();
	}

</script>



<hr>
<!-- Record -->
<button onclick={add_current}>save</button>
<button onclick={() => record_log.reset()}>reset</button>

{#each record_log.log as log, index}
	{@const url = `./?name=${log.name}&pms=${log.status}`}
	<div title={log.status}>
		<button onclick={() => record_log.remove(index)}>
			{index}
		</button>

		<code onclick={() => record_log.renew(index)}>{log.time}</code>
		-
		<a href={url} onclick={(e) => apply_link(e, index, url)}>
			<span class={log.name === current_name ? 'font-weight:900' : ''}>
				{log.name}
			</span>
		</a>
	</div>
{/each}

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

<div class="pm-list display:flex flex-wrap:wrap gap:2em place-content:center">
	{#each groups as group, index}
		<div class="pm-group position:relative display:flex flex-wrap:wrap place-content:center gap:.5em">
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