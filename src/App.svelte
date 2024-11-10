<script>
	import pm_url from '@data/pm.csv?url';
	// import name from '@data/name.csv';
	import List from '@comp/List.svelte';
	import Ctrl from '@comp/Ctrl.svelte';
	import Footer from '@comp/Footer.svelte';
	import { recorder, } from '@lib/recorder.svelte.js';

	// import { _, } from 'svelte-i18n';
	import { get_pms, } from '@lib/pm.js';
	import { get_item, } from '@lib/u.js';

	async function init() {
		let url = get_item('custom-url') || pm_url;
		console.log('fetch data url:', url);

		console.log(32, recorder.records);

		const { pms, groups, max_index, } = await get_pms(pm_url);
		// console.log(44, { pms, groups });

		return {
			pms,
			groups,
			max_index,
		};
	}

	function reset_ls() {
		localStorage.clear();
	}

</script>

<hr >

{#await init()}
	Loading...

{:then  { pms, groups, max_index, } }

	<Ctrl />
	<List {groups} {pms} maxindex={max_index} />

{:catch error}
	GG
	<button onclick={() => reset_ls()}>try to reset localStorage</button>

{/await}
<hr>

<Footer />
