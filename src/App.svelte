<script>
	import { pms_status, urls, nickname, } from './stores.js';
	import { trans_status_to_qs, } from '@/u.js';

	import Ctrl from '@comp/Ctrl.svelte';
	import Header from '@comp/Header.svelte';
	import List from './comp/List.svelte';

	// check status with current record before unload page
	window.addEventListener('beforeunload', (e) => {
		let current_status = trans_status_to_qs($pms_status);
		let current_record = $urls.find(url => url.title === $nickname);

		if (
			current_status &&
			current_record?.status !== current_status
		) {
			e.preventDefault();
			e.returnValue = '';
		}
	});

</script>

<main>
	<Ctrl />

	<Header />

	<List />

	<footer>
		<a href="https://leekduck.com/shiny/">https://leekduck.com/shiny/</a>
	</footer>

</main>
