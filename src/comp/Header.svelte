<script>
	import { _, locale } from 'svelte-i18n';
	import {
		pms_status,
		nickname,
		config,
	} from '@/stores.js';

	$: counts = count_status($pms_status);
	function count_status(status) {
		let sum = status.length;
		let count = [0, 0, 0, 0];
		for (let s of status) {
			count[s.status] += 1;
		}
		count[4] = status.length;
		return count;
	}

	let status_title = [
		'never got',
		'dex',
		'in-bag',
		'overflow',
	];
</script>



<header>
	<h1>✨ Shiny Checklist</h1>

	<div class="flex status-counts">
		{#each $config.visible_status as i, index}
			<label
				class="status-count"
				class:active={ $config.visible_status[index] }
				data-status={ index }
				data-percent={ (counts[index] / counts[4]).toFixed(5) }
			>
				<input class="visually-hidden" type="checkbox"
					bind:checked={ $config.visible_status[index] }
				/>
				{ counts[index] }
				<br>
				{ status_title[index] }
			</label>
		{/each}
	</div>

	<label class="nickname">
		<span title="id 🆔">
			@
		</span>

		<span class="nickname-input" contenteditable
			bind:textContent={ $nickname }
		/>

		<!--
		<input class="nickname-input" type="text"
			bind:value={ $nickname }
			placeholder="Enter your ID"
		/>
		-->
	</label>
</header>




<style>
	header {
		position: relative;
		margin-bottom: 3em;
		padding-bottom: 2em;
		padding-top: 2em;
		background-color: #ff0;
    background-image: linear-gradient(-230deg, #9e9e9e, #ff5722);
    text-align: center;
    color: #fff;
	}

	h1 {
		margin: 0 0 1em;
	}

	.status-counts {
		display: flex;
		width: fit-content;
		align-items: center;
		margin: 0 auto;
		gap: 2vw;
	}

	.status-count {
		display: flex;
		width: 5em;
		height: 5em;
		max-width: 15vw;
		padding: 1em;
		align-items: center;
		justify-content: center;
		border-radius: 10%;
		line-height: 1;
		background-color: #fff3;
		border: 2px solid #0000;

		&.active {
			border-color: #fff9;
		}
	}

	.nickname {
		position: absolute;
		bottom: 0;
		right: 0;
		padding-inline-start: 1em;

		&:hover {
			background-color: #fff3;
		}
	}
	.nickname-input {
		display: inline-block;
		min-width: 3em;
		padding-inline-end: .5em;

		& br {
			display: none;
		}
	}
</style>

