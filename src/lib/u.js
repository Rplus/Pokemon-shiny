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

export function get_time_string(time = new Date()) {
	return time.toLocaleString('sv-SE').replace(' ', 'T');
}
