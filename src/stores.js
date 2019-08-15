import { writable, derived } from 'svelte/store';
import { saveItem, getItem } from './u.js';

function genSearchStr(params) {
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

export const langs = ['de', 'en', 'fr', 'ja', 'kr', 'zh'];
export const lang = writable(langs[5]);

export const shows = ['all', 'dex', 'own'];
export const show = writable(shows[0]);

// export const tags = ['all', 'dex', 'own'];
// export const tag = writable(tags[0]);

export const nickname = writable('?');

export const dex = writable({});

export const searchStr = derived(
  [dex, nickname, lang, show],
  ([$dex, $nickname, $lang, $show]) => genSearchStr({
    nickname: $nickname,
    dex: $dex[1],
    own: $dex[2],
    show: $show,
    lang: $lang,
  })
);
