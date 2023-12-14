<script>
	import { _, locale, locales } from 'svelte-i18n';
	import {
		config,
		default_config,
	} from '@/stores.js';

	import Record from '@comp/Record.svelte';

	let panel_visibility = false;

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

		<fieldset>
			<legend>Order by</legend>

			<label>
				<input type="radio"
					bind:group={$config.order_by}
					value="group"
				/>
				Group
			</label>

			<label>
				<input type="radio"
					bind:group={$config.order_by}
					value="dex"
				/>
				Pokedex
			</label>

			<label>
				<input type="radio"
					bind:group={$config.order_by}
					value="time"
				/>
				Time
			</label>

			<!-- TODO: -->
			<!-- Dex Filter -->
		</fieldset>

		<fieldset>
			<legend>UI</legend>

			<label>
				🌐 {$_('lang')}
				<select bind:value={$locale}>
					{#each $locales as lang}
						<option value={lang} label={lang} />
					{/each}
				</select>
			</label>

			<hr>

			<div>🎨 {$_('colors')}</div>
			<div class="flex" style="gap: .5em">
				<input type="color" bind:value={$config.colors[0]}>
				<input type="color" bind:value={$config.colors[1]}>
				<input type="reset" on:click={reset_colors}>
			</div>
		</fieldset>


		<Record />

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
		max-width: calc(100% - 2em);
		padding: 1em 5vmin 5em;
		background-color: #fff;
		overflow: auto;
		box-shadow: .1em 0 .5em #0006;

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
</style>
