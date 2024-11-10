<script>
	// import { _, locale } from 'svelte-i18n';
	// import { pick, get_time_string, } from '@/u.js';

	// import { name, status, } from '@/stores.js';
	// import { recorder, } from '@lib/recorder.svelte.js';

	// const titles = ['debut', 'name', 'dex', 'fn', 'group', 'status'];

	// function export_as_csv() {
	// 	// console.log(111, 'export_as_csv');
	// 	// console.log($pms_status, $pms);

	// 	let _pms = $pms.map((pm, index) => {
	// 		let _pm = pick(pm, titles);
	// 		_pm.name = _pm.name[$locale] || _pm.name.en;
	// 		_pm.status = $pms_status[index].status;
	// 		return _pm;
	// 	});

	// 	let csv = _pms.map(pm => {
	// 		return titles.map(prop => pm[prop] || '').join(',');
	// 	});
	// 	csv.unshift(titles);

	// 	let time = new Date();

	// 	downloadURI(
	// 		getAllText(csv.join('\n')),
	// 		`Shiny-PM-${$nickname}-${get_time_string()}.csv`
	// 	);
	// }

	// function getAllText(cxt) {
	// 	return `data:text/csv;charset=utf-8,${encodeURIComponent(cxt)}`;
	// }

	// function downloadURI(uri, name) {
	// 	let doc = document.createDocumentFragment();
	// 	let link = document.createElement('a');
	// 	link.download = name;
	// 	link.href = uri;
	// 	doc.appendChild(link);
	// 	link.click();
	// 	doc = null;
	// }

</script>


<div>
	<div class="text-right">
		<!-- <button on:click={export_as_csv}>📥 {$_('export.as.csv')}</button> -->
	</div>
</div>
