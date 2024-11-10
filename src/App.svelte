<script context="module">
	import List from '@comp/List.svelte';
	import Ctrl from '@comp/Ctrl.svelte';
	import Footer from '@comp/Footer.svelte';

	import { pm_data, } from '@lib/pm.svelte.js';
	import { get_item, } from '@lib/u.js';

	async function init() {
		// let pm_handler = await pm_data();
		return await pm_data;
	}

	function reset_ls() {
		localStorage.clear();
	}

</script>

<hr >

{#await init()}
	Loading...

{:then}
	<Ctrl />
	<List />

{:catch error}
	GG!
	<button onclick={() => reset_ls()}>try to reset localStorage</button>

{/await}
<hr>

<Footer />
