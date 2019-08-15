import { writable, derived } from 'svelte/store';
import { saveItem, getItem } from './u.js';

function genSearchStr(params) {
  return new URLSearchParams(deleteEmptyProp(params)).toString();
}


function deleteEmptyProp(obj) {
  for (let p in obj) {
    if (obj[p] == null) {
      delete obj[p];
    }
  }
  return obj;
}

export const langs = ['de', 'en', 'fr', 'ja', 'kr', 'zh'];
export const lang = writable(langs[5]);

export const tags = ['all', 'dex', 'own'];
export const tag = writable(tags[0]);

export const oTitle = writable('✨ | Pokemon Shiny Checklist');

export const search = writable({});

export const searchStr = derived(
  search,
  $search => genSearchStr($search)
);
// export const showStatus = ['all', 1, 2];


// function createUrls() {
//   let _urls = getItem('historeUrls') || [];

//   const { subscribe, set, update } = writable(_urls);

//   return {
//     subscribe,

//     add: (a) => update(n =>
//       [...new Set( [...n, a] )]
//     ),

//     remove: (a) => update(n =>
//       n.filter(i => i !== a)
//     ),

//     reset: () => set([]),
//   };
// }

// export const historeUrls = createUrls();

// export const savedUrl = derived(
//   historeUrls,
//   $historeUrls => {
//     saveItem({
//       key: 'historeUrls',
//       value: $historeUrls,
//     });
//     return $historeUrls;
//   }
// );
