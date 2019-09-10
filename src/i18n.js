import { locale, dictionary } from 'svelte-i18n';
import { lang, langs } from './stores.js';
import { isDev } from './u.js';

let _defaultLang = 'en';

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
  },
  'reset': {
    'en': 'RESET ✨',
    'zh': '重置 ✨',
    'de': 'Zurücksetzen ✨',
    'it': 'Reimposta ✨',
  },
  'select.all': {
    'en': 'Select All',
    'zh': '全選',
    'de': 'Wählen Sie Alle',
    'it': 'Seleziona Tutti',
  },
  'show': {
    'en': 'Show',
    'zh': '顯示',
    'de': 'Show',
    'it': 'Mostra',
  },
  'show.all': {
    'en': 'All',
    'zh': '全部',
    'de': 'Alles',
    'it': 'Tutti',
  },
  'show.dex': {
    'en': 'Registered',
    'zh': '已開圖',
    'de': 'Eingetragen',
    'it': 'Registrati',
  },
  'show.own': {
    'en': 'Selected',
    'zh': '現持有',
    'de': 'Ausgewählt',
    'it': 'Selezionati',
  },
  'show.offer': {
    'en': 'Tradable',
    'zh': '可交換',
    'de': 'Handelbar',
    'it': 'Negoziabili',
  },
  'show.unregistered': {
    'en': 'Unregistered',
    'zh': '未開圖',
    'de': 'Nicht registriert',
    'it': 'Non registrato',
  },
  'owns': {
    'en': 'Owns',
    'zh': '現有',
    'de': 'Besitzt',
    'it': 'Posseduti',
  },
  'registered': {
    'en': 'Registered',
    'zh': '已開圖',
    'de': 'Eingetragen',
    'it': 'Registrati',
  },
  'released': {
    'en': 'released',
    'zh': '已釋出',
    'de': 'veröffentlicht',
    'it': 'Rilasciati',
  },
  'share.shiny.list': {
    'en': 'Share shiny list',
    'zh': '分享個人色違清單',
    'de': 'Shinyliste teilen',
    'it': 'Condividi Shiny Checklist',
  },
  'compare.image': {
    'en': 'Compare images?',
    'zh': '比對圖片?',
    'de': 'Bilder vergleichen?',
    'it': 'Confronta le immagini?',
  },
  'get.short.url': {
    'en': 'Get short url',
    'zh': '取得短網址',
    'de': 'Kurze URL erhalten',
    'it': 'Ottieni URL veloce',
  },
  'share.with.short.url': {
    'en': 'Share with short url:',
    'zh': '以短網址分享:',
    'de': 'Mit kurzer URL teilen:',
    'it': 'Condividi tramite URL veloce',
  },
  'share.url.directly': {
    'en': 'Please share URL directly :)',
    'zh': '請直接分享網址 ：）',
    'de': 'Bitte teile deine URL direkt :)',
    'it': 'Condividi URL diretto',
  },
  'confirm.to.remove': {
    'en': 'Are you sure to remove 【{item}】?',
    'zh': '是否移除 【{item}】？',
    'de': 'Möchten Sie 【{item}】 wirklich entfernen?',
    'it': 'Sei sicuro di rimuovere 【{item}】?',
    // 'ja': '【{item}】 を削除してもよろしいですか？',
    // 'kr': 'XXX을 (를) 삭제 하시겠습니까?',
  },
  'ctrl.switcher': {
    'en': 'Controller',
    'zh': '控制項',
  },
  'lock.list': {
    'en': 'Lock List',
    'zh': '鎖定清單點擊',
  },
  'save': {
    'en': 'Save',
    'zh': '儲存',
    'de': 'Speichern',
    'it': 'Salvare',
  },
  'saved.items': {
    'en': 'Saved items',
    'zh': '已存項目',
    'de': 'Speichern',
    'it': 'Salvare',
  },
  'browser.notice': {
    'en': 'Please use Chrome / Firefox to ensure working properly.',
    'zh': '請盡量使用 Chrome / Firefox 瀏覽，以確保功能 & 樣式正常運作',
    'de': 'Bitte benutze Chrome / Firefox damit die Seite wirklich funktioniert.',
    'it': 'Per ottimizzare la checklist si consiglia di usare Chrome o Firefox.',
  },
  'export': {
    'en': 'Export',
    'zh': '輸出',
    'de': 'Exportieren',
    'it': 'Esporta',
  },
  'generate.image': {
    'en': 'Generate image',
    'zh': '生成圖片',
    'de': 'Bild generieren',
    'it': 'Genera immagine',
  },
  'width': {
    'en': 'Width',
    'zh': '寬度',
    'de': 'Breite',
    'it': 'larghezza',
  },
  'scale': {
    'en': 'Scale',
    'zh': '縮放比',
    'de': 'Rahmen',
    'it': 'Scala',
  },
  'set.width': {
    'en': 'Set',
    'zh': '設置',
    'de': 'Verwenden',
    'it': 'Imposta',
  },
  'reset.width': {
    'en': 'Reset',
    'zh': '重設',
    'de': 'Zurücksetzen',
    'it': 'Reimposta',
  },
};

let missingTransition = [];

for (let _w in _words) {
  for (let _l in langs) {
    let lng = langs[_l];
    if (!resources[lng]) {
      resources[lng] = {};
    }
    resources[lng][_w] = _words[_w][lng] || _words[_w][_defaultLang];
    if (!_words[_w][lng]) {
      missingTransition.push([lng, _w].join());
    }
  }
}

if (missingTransition.length && isDev()) {
  console.warn({ missingTransition });
}

dictionary.set(resources);

locale.set(_defaultLang);

lang.subscribe(value => {
  locale.set(value);
});
