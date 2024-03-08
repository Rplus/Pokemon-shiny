<script>
	import { _, locale, locales } from 'svelte-i18n';
	import {
		config,
		default_config,
	} from '@/stores.js';

	import Lang from '@comp/Lang.svelte';
	import Order from '@comp/Order.svelte';
	import Record from '@comp/Record.svelte';
	import Share from '@comp/Share.svelte';
	import Export from '@comp/Export.svelte';

	let panel_visibility = !false;

	function reset_colors() {
		$config.colors = {...default_config.colors};
	}
</script>


<aside class="ctrl-panel">
	<input type="checkbox"
		id="ctrl-switch"
		class="visually-hidden"
		bind:checked={ panel_visibility }
	/>

	<label for="ctrl-switch"
		class="float-btn"
		class:active={ panel_visibility }
	>
		⚙️
	</label>

	<div class="ctrl-content" class:active={ panel_visibility }>

		<details bind:open={$config.tab.orderby}>
			<summary>🔃 {$_('order')}</summary>
			<Order />
		</details>

		<details bind:open={$config.tab.record}>
			<summary>💾 {$_('record')}</summary>
			<Record />
		</details>

		<details bind:open={$config.tab.share}>
			<summary>🔀 {$_('share')}</summary>
			<Share />
		</details>

		<details bind:open={$config.tab.export}>
			<summary>📥 {$_('export')}</summary>
			<Export />
		</details>

		<details bind:open={$config.tab.ui}>
			<summary>🔧 {$_('UI')}</summary>
			<div>
				<Lang />

				<hr>

				<div>🎨 {$_('colors')}</div>
				<div class="flex" style="gap: .5em; margin-inline-start: 1.5em;">
					<input type="color" bind:value={$config.colors[0]}>
					<input type="color" bind:value={$config.colors[1]}>
					<input type="reset" on:click={reset_colors}>
				</div>

				<hr>
				<label class="flex">
					🔎
					<input type="checkbox" bind:checked={$config.compare}>
					{$_('compare.image')}
				</label>
			</div>
		</details>

	</div>

	<label
		for="ctrl-switch"
		class="ctrl-switch-overlay"
		class:active={ panel_visibility }
	/>

</aside>



<style>
	.ctrl-content {
		position: fixed;
		top: 1em;
		left: 1em;
		bottom: 1em;
		z-index: 11;
		min-width: 250px;
		max-width: calc(100% - 2em);
		padding: 1em .5em 3em;
		background-color: #fff;
		overflow: auto;
		box-shadow: .1em 0 .5em #0006;
		line-height: 1.75;
		font-size: smaller;

		&:not(.active) {
			visibility: hidden;
		}

		& fieldset {
			margin-bottom: 1em;
			border-color: #6663;
			padding-bottom: 1em;
		}
	}

	.ctrl-switch-overlay {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 10;
		width: 1em;
		background-color: #0006;
		opacity: 0.3;

		&.active {
			opacity: 1;
			width: 100%;
			-webkit-backdrop-filter: blur(3px);
			backdrop-filter: blur(3px);
		}
	}

	details {
		margin-bottom: .5em;
		padding: .5em .5rem;

		& ul {
			padding-left: 1em;
		}

		&:not([open]) summary::after {
			rotate: 0deg;
		}
	}

	summary {
		position: relative;
		padding: .5em 2em .5em 1em;
		margin-left: -1em;
		margin-right: -1em;
		background-color: #eee;
		cursor: pointer;

		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 50%;
			translate: 0 -50%;
			right: 1em;
			width: 3px;
			height: 1em;
			background-color: #ccc;
			rotate: 90deg;
			transition: rotate .2s;
		}

		&::marker {
			content: '';
		}

		& + div {
			margin-top: 0.5em;
		}

	}
</style>
