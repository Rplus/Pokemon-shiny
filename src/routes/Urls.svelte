<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

import {
  searchStr,
  lang,
  show,
  nickname,
  dex,
} from '../stores.js';

import {
  saveItem,
  getItem,
  getISOFormatedTime,
} from '../u.js';

let urls = getItem('urls') || {};

$: urls;

function save() {
  console.log('save', $searchStr);

  window.getItem = getItem;
  let _searchObj = new URLSearchParams($searchStr);
  let title = _searchObj.get('nickname') || '';

  urls[title] = {
    value: _searchObj.toString(),
    time: getISOFormatedTime(),
  };
  updateUrl();
}

function remove(savedItem) {
  if (urls[savedItem]) {
    urls[savedItem] = {};
    delete urls[savedItem];
    updateUrl();
  }
}

function updateUrl() {
  saveItem({
    key: 'urls',
    value: urls,
  });
}

function apply(urlStr) {
  let urlP = new URLSearchParams(urlStr);
  $lang = urlP.get('lang');
  $show = urlP.get('show');
  $nickname = urlP.get('nickname');
  // $dex = urlP.get('dex');
  // $own = urlP.get('own');
}

</script>

urlss~~~
<button on:click={ save }>Save</button>


{#each Object.keys(urls) as savedItem}
  <div class="saved-item">
    <button on:click|preventDefault={ remove.bind(this, savedItem) }>x</button>
    <a
      href="./?{ urls[savedItem].value }"
      class:active={ savedItem === $nickname }
      on:click|preventDefault={ apply.bind(this, urls[savedItem].value) }
    >{ savedItem }</a>
    <code>{ urls[savedItem].value }</code>
  </div>
  <hr>
{/each}

