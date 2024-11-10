import raw_pms_url from '@data/pm.csv?url';
import raw_pms from '@data/pm.csv';
import raw_names from '@data/name.csv';
import raw_group from '@data/group.csv?raw';
import { csv2json, } from '@lib/u.js';

// import old_pms from '@data/pms.json';

export async function get_pms(pm_url = raw_pms_url) {
	try	{
		let response = await fetch(pm_url);
		if (!response.ok) {
			throw new Error(response.statusText);
		}

		let body = await response.text();
		return handle_pms(csv2json(body));
	} catch (error) {
		console.error(error);
	}
}

export function handle_pms() {

	// init_status = handle_status(init_status);
	// let skip_init = !init_status.length;
	// console.log(112, init_status);

	// handle name
	// console.log({raw_names});
	const names = raw_names.reduce((all, item) => {
		let { dex, ...name } = item;
		all[+dex] = name;
		return all;
	}, []);

	// handle pm debut
	const today = new Date();

	// let index_map = new Map();
	// let status_map = [];
	// let pid_map = [];

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
		// index_map.set(pm.pid, index);
		// pid_map[index] = pm.pid;
		// status_map[index] = skip_init ? 0 : (+init_status[index] || 0);

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
	let groups = raw_group.split('\n').map(row => {
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
		// status_map,
		// index_map,
		// pid_map,
	};
}

function handle_status(status = '') {
	return status.split('');
}
