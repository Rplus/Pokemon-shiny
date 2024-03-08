<script>
	import {
		pms,
		pms_status,
		config,
	} from '@/stores.js';
	import Pokemon from '@comp/Pokemon.svelte';

	$: hidden_status_classes = $config.visible_status
		.map((i, index) => i ? '' : ` hidden-status-${index}`)
		.join('');

	$: console.log(11, $pms_status);

	function reset_all() {
		console.log('reset_all');
		pms_status.set($pms_status.map(i => {
			i.status = 0;
			return i;
		}))
	}
	function select_all() {
		pms_status.set($pms_status.map(i => {
			if (!i.status) {
				i.status = 1;
			}
			return i;
		}))
	}

</script>



<button on:click={select_all}>selector all</button>
<button on:click={reset_all}>reset all</button>

<div
	class="list {hidden_status_classes}"
	data-order-by={$config.order_by}
>
	{#each $pms as pm, pm_index (pm.fn)}
		<Pokemon
			pm={pm}
			bind:status={$pms_status[pm_index].status}
		/>
	{/each}
</div>



<style>
	.list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		column-gap: .25em;
		row-gap: .75em;

		&[data-order-by="dex"] .item {
			order: var(--dex-order);
		}

		&[data-order-by="time"] .item {
			order: var(--time-order);
		}

		&[data-order-by="group"] {
			order: var(--group-order);

			& .item {
				&.group-start { margin-inline-start: .5em; }
				&.group-end { margin-inline-end: .5em; }
			}
		}
	}
</style>
