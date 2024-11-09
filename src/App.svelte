<script>
	// import pm from '@data/pm.csv';
	// import name from '@data/name.csv';
	import List from '@lib/List.svelte';
	import Ctrl from '@lib/Ctrl.svelte';
	import Footer from '@lib/Footer.svelte';
	import { _, } from 'svelte-i18n';
	import { get_all_record, } from '@lib/u.js';
	// import { get_item, } from '@lib/u.js';

	// init = location.search || storage.log[0]
	let qs = new URL(location).searchParams;
	let init_status = qs.get('pms') || '';
	let init_name = qs.get('name') || 'name';

	let init_info = {
		name: '',
		status: '',
	};

	if (qs.get('pms')) {
		init_info.status = qs.get('pms') || '';
		init_info.name = qs.get('name') || 'name';
	}

	// reset location.search to prevent confus
	if (location.search) {
		history.pushState({}, null, './');
	}

	let promise = $state(get_all_record());

</script>

<hr >

{#await promise}
{:then ori_log}
	<!-- <Ctrl /> -->
	<List {init_info} {ori_log} />
{:catch error}
{/await}

<hr>

<Footer />
