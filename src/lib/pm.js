import raw_pms from '@data/pm.csv';
import raw_names from '@data/name.csv';
import raw_group from '@data/group.csv?raw';

// import old_pms from '@data/pms.json';

export function handle_pms(init_status = '') {

	init_status = handle_status(init_status);
	let skip_init = !init_status.length;
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
	let status_map = [];
	// let pid_map = [];

	let pms = raw_pms.map(pm => {
		let dex = +(pm.pid.match(/pm(\d+)/)?.[1]);

		if (!(new Date(pm.debut) < today)) {
			return;
		}

		let index = +pm.index;

		// index_map.set(pm.pid, index);
		// pid_map[index] = pm.pid;
		status_map[index] = skip_init ? 0 : (+init_status[index] || 0);

		return {
			...pm,
			index,
			dex,
			name: names[dex],
			time_order: +new Date(pm.debut) / 1000 + dex,
			// costume: pm.pid.includes('.'),
			// shiny: new Date(pm.debut) < today,
			// status: 0,
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
		status_map,
		// index_map,
		// pid_map,
	};
}

function handle_status(status = '') {
	return status.split('');
}
