import pm_local_csv_url from '@data/pm.csv?url';
import group_local_csv_url from '@data/group.csv?url';
import raw_names from '@data/name.csv';

import { csv2json, fetch_data, get_item, } from '@lib/u.js';

export const pm_data = await get_pms();

export async function get_pms() {
	let pm_csv_url = get_item('pm_custom_csv_url') || pm_local_csv_url;
	let group_csv_url = get_item('group_custom_csv_url') || group_local_csv_url;

	let [ pm_csv, group_csv ] = await Promise.all(
		[pm_csv_url, group_csv_url].map(async (url) => fetch_data(url, 'csv'))
	)

	// let { pms, groups, max_index, } = handle_pms(csv2json(pm_csv), group_csv);
	return handle_pms(csv2json(pm_csv), group_csv);
}

export function handle_pms(raw_pms, group_csv) {
	// handle name
	// console.log({raw_names});
	const names = raw_names.reduce((all, item) => {
		let { dex, ...name } = item;
		all[+dex] = name;
		return all;
	}, []);

	// handle pm debut
	const today = new Date();

	let max_index = 0;

	let pms = raw_pms.map(pm => {
		let dex = +(pm.pid.match(/pm(\d+)/)?.[1]);

		if (!(new Date(pm.debut) < today)) {
			return;
		}

		let index = +pm.index;

		if (index > max_index) {
			max_index = index;
		}

		return {
			...pm,
			index,
			dex,
			name: names[dex],
			time_order: +new Date(pm.debut) / 1000 + dex,
			// costume: pm.pid.includes('.'),
			// shiny: new Date(pm.debut) < today,
			status: '0',
		}
	})
	.filter(Boolean);

	// grouping
	let groups = group_csv.split('\n').map(row => {
		let [label, ...pids] = row.split(',');
		return {
			label,
			pms: pids.map(pid => pms.find(pm => pm.pid === pid)),
		};
	});

	return {
		pms,
		groups,
		max_index,
	};
}
