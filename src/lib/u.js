import * as localForage  from 'localforage';

const STORAGE_KEY = 'pm-shiny-sv5';

export function set_item(key, data) {
	if (!key) { return false; }
	let _data = get_item();
	_data[key] = data;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
};

export function get_item(key) {
	let _data = localStorage.getItem(STORAGE_KEY);
	if (!_data) { return {}; }
	_data = JSON.parse(_data);
	return key ? _data[key] : _data;
};

async function set_lf_data(key, data) {
	return await localForage.setItem(`${STORAGE_KEY}-record`, data);
}
async function get_lf_data(key) {
	return await localForage.getItem(`${STORAGE_KEY}-${key}`);
}
// for user selected status
export async function set_all_record(record) {
	console.log(333, record);
	return await set_lf_data('record', record);
}
export async function get_all_record() {
	return await get_lf_data('record') || [{
		name: '',
		status: '',
		time: 0,
	}];
}

export function isDev() {
	return location.hostname === 'localhost';
}

export function get_time_string(time = new Date()) {
	return time.toLocaleString('sv-SE').replace(' ', 'T');
}

export function get_pm_img_src(fn = '', shiny = true) {
	let url = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets/Images/Pokemon%20-%20256x256/Addressable%20Assets/${fn}.${shiny ? 's.' : ''}icon.png`;
	return `https://wsrv.nl/?&ll&output=webp&default=1&url=${url}`;
}

export function get_name(names, lang = 'en') {
	return names?.[lang] || names?.en || '';
}

export function sort_by(prop, dir = 'asc') {
	return (a, b) => dir === 'asc' ? a[prop] - b[prop] : b[prop] - a[prop];
}
export function rev_sort_by(prop) {
	return sort_by(prop, 'desc');
}

export function once(fn) {
	return function (event) {
		if (fn) fn.call(this, event);
		fn = null;
	};
}

export function preventDefault(fn) {
	return function (event) {
		event.preventDefault();
		fn.call(this, event);
	};
}