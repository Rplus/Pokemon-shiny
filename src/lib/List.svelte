<script>
	import { _, } from 'svelte-i18n';
	import { handle_pms, } from '@lib/pm.js';
	import { get_pm_img_src, get_name, } from '@lib/u.js';

	// import '@lib/check_new_pm.js';

	import Item from '@lib/Item.svelte';

	let { init_status = '', } = $props();

	// let init_status = '';

	let {
		pms,
		groups,
		// index_map,
		status_map,
	} = handle_pms(init_status);

	// console.log({index_map,status_map});

	console.log(pms.length);
	console.log(status_map.length);

	let pms_status = $state(status_map);

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

	function count(arr = []) {
		return arr.reduce((all, i) => {
			if (i || i === 0) {
				if (!all[i]) {
					all[i] = 0;
				}
				all[i] += 1;
			}
			return all;
		}, [0, 0, 0, 0]);
	}

	function handle_click(index) {
		pms_status[index] = (pms_status[index] + 1) % 4;
	}
</script>


<details class="text-align:center">
	<summary>
		counter: {status_counter.counts}
	</summary>
	<div class="word-break:break-all">
		{status_counter.string}
	</div>
</details>
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
				<Item {pm} status={pms_status[pm.index]} {handle_click} />
			{/each}

		</div>
	{/each}
</div>


<style>
	.pm-group:not(:has(.pm.status-1, .pm.status-2, .pm.status-3)) {
		opacity: 0.3;
	}
</style>