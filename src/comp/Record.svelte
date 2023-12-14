<script>
	import { _, locale } from 'svelte-i18n';
	import {
		default_nickname,
		nickname,
		pms_status,
		urls,
	} from '@/stores.js';

	import {
		saveItem,
		trans_status_to_qs,
		trans_qs_to_status,
		gen_href,
	} from '@/u.js';

	$: {
		// console.log('urls changed', $urls);
	}

	function save() {
		urls.add({
			title: $nickname || default_nickname,
			status: trans_status_to_qs($pms_status),
			time: +new Date(),
		});
	}

	function remove(url) {
		let ans = window.confirm($_('remove.record', {
			values: {
				title: url.title,
			}
		}));
		if (ans) {
			urls.remove(url);
		}
	}

	function apply(url) {
		$pms_status = trans_qs_to_status(url.status, $pms_status);
		$nickname = url.title;
	}

	function gen_title(record) {
		return `${(record.time)}\x0A\x0A${decodeURIComponent(record.status).split('&').join('\x0A')}`;
	}

</script>


<button class="float-btn" style="left: 3.5em"
	on:click={save}
>💾</button>

<div>

	{#if $urls.length}
		<ul>
			{#each $urls as url}
				<li class:active={url.title === $nickname}>
					<button on:click={() => remove(url)}>❌🗑️ </button>
					<a href={gen_href(url)}
						on:click|preventDefault={() => apply(url)}
						title={gen_title(url)}
					>
						👁️‍🗨️ {url.title}
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="text-right">
		<hr>
		<button on:click={save}>💾 save</button>
	</div>

</div>


<style>
	li.active {
		background-color: #ff03;
	}
</style>
