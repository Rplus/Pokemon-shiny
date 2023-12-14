<script>
	import { _, locale } from 'svelte-i18n';

	import { nickname, urls, } from '@/stores.js';
	import { gen_href, } from '@/u.js';

	$: current_url = $urls.find(url => url.title === $nickname);

	let is_fetching = false;
	let short_href = null;

	async function gen_short_href() {
		if (is_fetching) {
			alert('');
			return;
		}

		is_fetching = true;

		const url = gen_href(current_url);
		const encoded_url = encodeURIComponent(`http://tinyurl.com/api-create.php?url=${url}`);
		const res = await fetch(`https://api.allorigins.win/get?url=${encoded_url}`);

		is_fetching = null;

		if (res.ok) {
			let json = await res.json();

			if (json.contents === 'Error') {
				throw new Error(JSON.stringify(json));
			} else {
				short_href = json.contents;
				return json.contents;
			}

		} else {
			throw new Error(await res.text());
		}
	}

	function get_qrcode_img(url) {
    return `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${url}&choe=UTF-8`;
	}
</script>


<div>
	{$_('share.intro')}

	<ul>
		<li><a href={gen_href(current_url)}>{$_('share.origin.url')}</a></li>
		<li>
			<a href={short_href}>{$_('share.short.link')}</a>
			{#if short_href}
				<img class="block" src={ get_qrcode_img(short_href) } alt="">
			{/if}
		</li>
	</ul>
	<div class="text-right">
		<hr>
		<button on:click={gen_short_href}>📦 {$_('share.get.short.url')}</button>
	</div>
</div>


<style>
	li:has(a[href])::marker {
		content: '🔗 ';
	}

	img {
		margin-left: -1.5em;
	}
</style>