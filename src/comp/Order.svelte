<script>
	import { _, } from 'svelte-i18n';
	import { config, MAX_DEX, } from '@/stores.js';

	let dex_range_1 = 1;
	let dex_range_2 = MAX_DEX;

	let o_arr = new Array(MAX_DEX).fill(1).map((i, index) => 1 + index);

	$: style = gen_dex_filter_style(dex_range_1, dex_range_2);

	function gen_dex_filter_style(range_1, range_2) {
		let [min, max] = [range_1, range_2].sort(sort_by_number);
		let unselected_arr = o_arr.filter(i => i < min || i > max);
		if (!unselected_arr.length) {
			return '';
		}

		let selectors = unselected_arr.map(dex => `.pokedex-${dex}`).join(',');
		return `<style>${selectors} { display: none; }</style>`;
	}

	function sort_by_number(a, b) {
		return a - b;
	}
</script>


<div>
	<div>
		{@html style}
	</div>
	<label class="block">
		<input type="radio"
			bind:group={$config.order_by}
			value="group"
		/>
		{$_('order.by.group')}
	</label>

	<label class="block">
		<input type="radio"
			bind:group={$config.order_by}
			value="dex"
		/>
		{$_('order.by.dex')}
	</label>

	<label class="block">
		<input type="radio"
			bind:group={$config.order_by}
			value="time"
		/>
		{$_('order.by.time')}
	</label>

	<hr>
	<div style="padding-left: 1.5em">
		<!-- TODO: -->
		<!-- Dex Filter -->
		↔️ {$_('order.dex.range')}
		<div class="flex">
			<input type="range" bind:value={dex_range_1} max={MAX_DEX} min={1} step="1">
			<input type="number" bind:value={dex_range_1} max={MAX_DEX} min={1} step="1">
		</div>

		<div class="flex">
			<input type="range" bind:value={dex_range_2} max={MAX_DEX} min={1} step="1">
			<input type="number" bind:value={dex_range_2} max={MAX_DEX} min={1} step="1">
		</div>
	</div>
</div>