import { writable, derived } from 'svelte/store';
import { saveItem, getItem } from './u.js';

export const nickname = writable('?');

export const langs = ['de', 'en', 'it', 'fr', 'ja', 'kr', 'zh'];

let _langIndex = langs.indexOf(
  navigator.language && navigator.language.split('-').shift()
);

if (_langIndex === -1) {
  _langIndex = 1;
}

export const lang = writable(langs[_langIndex]);

export const shows = ['all', 'dex', 'own', 'offer'];
export const show = writable(shows[0]);
export const showUnregistered = writable(false);

export const dex = writable({});
export const pmTotalStatus = writable({});


export const compareImg = writable(getItem('config.compareImg'));

export const saveConfigForCompareImg = (value) => {
  saveItem({
    key: 'config.compareImg',
    value: !!value,
  });
};

export const searchStr = derived(
  [dex, nickname, lang, show],
  ([$dex, $nickname, $lang, $show]) => genSearchStr({
    nickname: $nickname,
    dex: $dex,
    show: $show,
    lang: $lang,
  })
);

function genSearchStr(params) {
  let dex = params.dex;
  delete params.dex;
  shows.forEach(i => {
    if (dex[i]) {
      params[i] = dex[i];
    }
  });
  return new URLSearchParams(deleteEmptyProp(params)).toString();
}

function deleteEmptyProp(obj) {
  for (let prop in obj) {
    if (!obj[prop]) {
      delete obj[prop];
    }
  }
  return obj;
}
