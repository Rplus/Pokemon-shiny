import pm_csv_url from './assets/data/pm.csv?url';
import name_json_url from './assets/data/name.min.json?url';
import name_csv_url from './assets/data/name.csv?url';
import { csv2json, trans_qs_to_status, } from './u.js';

function sort_by_gorder(a, b) {
	return a.g_order - b.g_order;
}

export async function fetch_data(init_status = '') {
	let raw_pms = csv2json(await fetch(pm_csv_url).then(r => r.text()));
	let raw_names = csv2json(await fetch(name_csv_url).then(r => r.text()));

	// handle name
	raw_names = raw_names.reduce((all, item) => {
		all[+item._dex] = item;
		delete item._dex;
		return all;
	}, []);

	// handle pm
	const today = new Date();

	let groups = [];
	let pms = raw_pms.filter(pm => {
		groups.push(pm.group);
		return pm.debut;
	});

	groups = [...new Set(groups)];
	const len_factor = Math.pow(10, Math.ceil(Math.log10(pms.length))) + pms.length;

	let MAX_DEX = 0;
	pms = pms.map(pm => {
		let dex_str = pm.fn.match(/pm(\d+)/)?.[1];
		let dex = +dex_str;

		if (dex > MAX_DEX) {
			MAX_DEX = dex;
		}

		let group_index = groups.indexOf(pm.group);
		if (group_index === -1) {
			console.error(pm, 'with wrong group_index');
		}

		return {
			...pm,
			dex,
			name: raw_names[dex],
			shiny: new Date(pm.debut) < today,
			// status: 0,
			g_order: group_index * len_factor + dex,
			t_order: +new Date(pm.debut) / 1000 + dex,
		}
	})
	.sort(sort_by_gorder);

	// console.log(pms, pms.length, len_factor);
	// console.log({groups});

	// handle grouping indicator
	let _group = '';
	for (let i = pms.length - 1; i >= 0; i--) {
		if (_group !== pms[i].group) {
			_group = pms[i].group;
			pms[i].group_end = true;

			if (pms[i + 1]) {
				pms[i + 1].group_start = true;
			}
		}
	}

	// TODO: dev
	pms = pms.slice(0, 87);

	return {
		MAX_DEX,
		pms: pms,
		status: trans_qs_to_status(init_status, pms),
	};
}
