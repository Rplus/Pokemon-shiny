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

export function get_pm_img_src(fn = '', shiny = true) {
	let url = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets/Images/Pokemon%20-%20256x256/Addressable%20Assets/${fn}.${shiny ? 's.' : ''}icon.png`;
	return `https://wsrv.nl/?&ll&output=webp&default=1&url=${url}`;
}

export function get_name(names, lang = 'en') {
	return names?.[lang] || names?.en || '';
}