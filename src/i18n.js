import { locale, init, addMessages } from 'svelte-i18n';
import { saveItem, getItem, isDev, } from '@/u.js';

let resources = {};
let _words = {
	'nickname': {
		'en': 'Nickname',
		'zh': '暱稱',
		'de': 'Nickname',
		'it': 'Nickname',
	},
	'lang': {
		'en': 'Language',
		'zh': '語系',
		'de': 'Sprache',
		'it': 'linguaggio',
		'fr': '',
		'ja': '',
		'ko': '',
	},
};

let langs = [...new Set(
	Object.values(_words)
		.map(i => Object.keys(i))
		.flat()
)];

let missing_words = [];

for (let _w in _words) {
	for (let lng of langs) {
		if (!resources[lng]) {
			resources[lng] = {};
		}
		if (_words[_w][lng]) {
			resources[lng][_w] = _words[_w][lng];
		} else {
			missing_words.push([lng, _w].join());
		}
	}
}
// console.log(resources);

if (missing_words.length && isDev()) {
	console.warn({ missing_words });
}

langs.forEach(lng => addMessages(lng, resources[lng]) );

let lang_index = langs.indexOf(
	navigator.language && navigator.language.split('-').shift()
);
let prefer_lang = lang_index === -1 ? 'en' : langs[lang_index];

init({
	fallbackLocale: 'en',
	initialLocale: getItem('lang') || prefer_lang,
});

locale.subscribe(_locale => {
	saveItem({
		key: 'lang',
		value: _locale,
	});
});
