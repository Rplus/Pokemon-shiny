<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

import {
  searchStr,
  lang,
  shows,
  show,
  nickname,
  dex,
} from '../stores.js';

import {
  saveItem,
  getItem,
  getISOFormatedTime,
} from '../u.js';

let urls = getItem('urls') || [];

const defaultOptions = {
  lang: 'en',
  show: 'all',
  nickname: '?',
};

// init with location.search or storage
if (location.search) {
  apply(location.search.slice(1));
  history.pushState({}, null, './');
} else if (urls.length > 0) {
  sortUrls();
  apply(urls[0].value);
}

function save() {
  let _searchObj = new URLSearchParams($searchStr);
  let _title = _searchObj.get('nickname') || '';

  let newItem = {
    title: _title,
    value: _searchObj.toString(),
    time: +new Date(),
  };

  let index = findIndexByTitle(_title);

  if (index === -1) {
    index = urls.length;
  }
  urls[index] = newItem;

  updateUrl();
}

function remove(savedItem) {
  let index = findIndexByTitle(savedItem);
  console.log('savedItem', savedItem, index);
  if (index !== -1) {
    urls.splice(index, 1);
    urls._trigger = null;
    updateUrl();
  }
}

function findIndexByTitle(title) {
  return urls.findIndex(url => url.title === title);
}

function updateUrl() {
  sortUrls();
  saveItem({
    key: 'urls',
    value: urls,
  });
}

function apply(urlStr) {
  let urlP = new URLSearchParams(urlStr);
  $lang = urlP.get('lang') || defaultOptions.lang;
  $show = urlP.get('show') || defaultOptions.show;
  $nickname = urlP.get('nickname') || defaultOptions.nickname;

  $dex = shows.reduce((all, i) => {
    all[i] = urlP.get(i);
    return all;
  }, {});
}

function sortUrls() {
  urls.sort((a, b) => {
    return b.time - a.time;
  });
}
</script>

urlss~~~
<button on:click={ save }>Save</button>


{#each urls as savedItem (savedItem.time)}
  <div class="saved-item">
    <button on:click|preventDefault={ remove.bind(this, savedItem.title) }>x</button>
    <a
      href="./?{ savedItem.value }"
      class:active={ savedItem === $nickname }
      on:click|preventDefault={ apply.bind(this, savedItem.value) }
    >{ savedItem.title }</a>
    <code>{ savedItem.value }</code>
    <time datatime={ getISOFormatedTime(savedItem.time) }>{ getISOFormatedTime(savedItem.time).slice(0, 10) }</time>
  </div>
  <hr>
{/each}

