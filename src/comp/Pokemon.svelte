<script>
	export let pm;
	export let status;

	import { _, locale } from 'svelte-i18n';
	import Image from '@comp/Image.svelte';

	$: {
		// console.log('pm updated', {status, pm});
	}

	function update_pm_status() {
		status = (status + 1) % 4;
	}

</script>


<div class="item pokedex-{pm.dex}"
	class:group-end={pm.group_end}
	class:group-start={pm.group_start}

	data-status={status}
	style="
		--group-order: {pm.g_order};
		--dex-order: {pm.dex};
		--time-order: {pm.t_order};"
>
	<details>
		<summary>
			#{pm.dex}
			{pm.name[$locale]}
			/ {status}
		</summary>
		<div>
			<pre>{JSON.stringify(pm,null,2)}</pre>
		</div>
	</details>

	<div class="img-box"
		on:click={update_pm_status}
	>
	<!--
		<Image
			fn={pm.fn}
			shiny={false}
			ext={pm.ext}
		/>
	-->
	</div>
</div>


<style>
	.item {
		position: relative;
	}

	:global(.hidden-status-0) .item[data-status="0"],
	:global(.hidden-status-1) .item[data-status="1"],
	:global(.hidden-status-2) .item[data-status="2"],
	:global(.hidden-status-3) .item[data-status="3"] {
		display: none;
	}

	details {
		position: absolute;
		font-size: small;
		max-width: 100%;
		white-space: nowrap;

		& summary {
			display: block;
			font-size: 10px;
		}

		& pre {
			position: absolute;
			background-color: #000a;
			color: #fff;
			margin: 0;
			z-index: 1;
		}
	}

	.img-box {
		border: 1px solid #000;
		cursor: cell;
		width: 128px;
		height: 128px;
	}
</style>
