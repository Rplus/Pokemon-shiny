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
	'order': {
		'en': 'Order',
		'zh': '排序',
	},
	'order.by.group': {
		'en': 'Order by group',
		'zh': '以家族排序',
	},
	'order.by.dex': {
		'en': 'Order by pokedex',
		'zh': '以圖鑑序排序',
	},
	'order.by.time': {
		'en': 'Order by time',
		'zh': '以時間排序',
	},
	'order.dex.range': {
		'en': 'Pokedex range',
		'zh': '圖鑑範圍',
	},
	'record': {
		'en': 'Record',
		'zh': '紀錄',
	},
	'record.save': {
		'en': 'Save',
		'zh': '儲存',
	},
	'share': {
		'en': 'Share',
		'zh': '分享',
	},
	'share.intro': {
		'en': 'Share or bookmarklet by url.',
		'zh': '藉由網址分享或加入書籤儲存',
	},
	'share.origin.url': {
		'en': 'Origin url',
		'zh': '原始網址',
	},
	'share.short.link': {
		'en': 'Short url',
		'zh': '短網址',
	},
	'share.get.short.url': {
		'en': 'Get short url',
		'zh': '取得短網址',
		'de': 'Kurze URL erhalten',
		'it': 'Ottieni URL veloce',
	},
	'remove.record': {
		'en': 'Remove 【 {title} 】?',
		'zh': '刪除 【 {title} 】？',
	},
	'export': {
		'en': 'Export',
		'zh': '匯出',
	},
	'export.as.csv': {
		'en': 'Export as CSV',
		'zh': '匯出為CSV',
	},
	'UI': {
		'en': 'UI',
		'zh': '界面',
	},
	'colors': {
		'en': 'Custom colors',
		'zh': '自訂顏色',
	},
	'compare.image': {
		'en': 'Compare image',
		'zh': '對照圖片',
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
