// https://opensheet.elk.sh/13UreWc5Nq4yiLYvDRt2RyPWXsDx9y4pMWhSD0JsnHCw/shiny

const STORAGE_KEY = 'pm-shiny';

export function saveItem(data) {
	if (!data || !data.key) { return false;}
	let odata = getItem() || {};

	odata[data.key] = data.value;

	localStorage.setItem(STORAGE_KEY, JSON.stringify(odata));
};

export function getItem(key) {
	let data = localStorage.getItem(STORAGE_KEY);
	if (!data) { return null; }
	data = JSON.parse(data);

	return key ? data[key] : data;
};

export function isDev() {
	return location.hostname === 'localhost';
}

export function csv2json(csv) {
	const lines = csv.split('\n');
	const result = [];
	const headers = lines[0].split(',');

	for (let i = 1; i < lines.length; i++) {
		if (!lines[i]) {
			continue;
		}
		const obj = {};
		const currentline = lines[i].split(',');

		for (let j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentline[j];
		}
		result.push(obj);
	}
	return result;
}

export function trans_status_to_qs(status) {
	return status
		.filter(i => i.status)
		.reduce((all, i) => {
			all[i.status] = !all[i.status]
				? `${i.status}=${i.fn}`
				: all[i.status] + `,${i.fn}`;

			return all;
		}, [])
		.filter(Boolean)
		.join('&');
}

export function trans_qs_to_status(qs = '', fns) {
	let record_status = [...new URLSearchParams(qs).entries()]
		.reduce((all, item) => {
			let _status = +item[0];

			item[1].split(',').forEach(fn => {
				all[fn] = _status;
			});

			return all;
		}, {});

	return fns.map(item => {
		return {
			fn: item.fn,
			status: record_status[item.fn] || 0,
		};
	});
}


export function sort_by_prop(prop, dir = -1) {
	return (dir === 1)
		? (a, b) => a[prop] - b[prop]
		: (a, b) => b[prop] - a[prop];
}

export function clone(obj) {
	return JSON.parse( JSON.stringify(obj) );
}
