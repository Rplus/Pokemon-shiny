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

</script>



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

		&[data-order-by="time"] .item {
			order: var(--time-order);
		}

		&[data-order-by="group"] {
			& .item {
				&.group-start { margin-inline-start: .5em; }
				&.group-end { margin-inline-end: .5em; }
			}
		}
	}
</style>
