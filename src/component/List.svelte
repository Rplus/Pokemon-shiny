<script>
	import { status, name, } from '@/stores.js';
	import Item from '@comp/Item.svelte';
	import { recorder, } from '@lib/recorder.svelte.js';
	import { pm_data, } from '@lib/pm.svelte.js';

	let { groups, pms, max_index, } = pm_data;

	let status_map = $state(
		$status.padEnd(max_index, '0').split('')
	);

	let status_string = $derived(status_map.join(''));

	// trigger
	if ($status !== status_string) {
		status.set(status_string);
	}

	function handle_click_pm(index = 0) {
		let new_status = (1 + status_map[index] || 0) % 4;
		status_map[index] = new_status;
		status.set(status_string);
	}

	function before_unload(event) {
		if (recorder.records?.[0].status !== status_string) {
			event.preventDefault();
	    event.returnValue = '';
		}
	}

</script>

<svelte:window on:beforeunload={before_unload}/>

<fieldset>
	<legend>
		name: <input type="text" bind:value={$name}>
	</legend>
	<!-- {$status} -->
	{status_string}
</fieldset>

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
				<Item {pm} status={status_map[pm.index]} {handle_click_pm} />
			{/each}

		</div>
	{/each}
</div>

<hr>