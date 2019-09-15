<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
import { _ } from 'svelte-i18n';

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
  let confirm = window.confirm($_('confirm.to.remove', { item: savedItem }));
  if (!confirm) { return; }

  let index = findIndexByTitle(savedItem);
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


// check is there any unsaved data
window.addEventListener('beforeunload', function (e) {
  let _searchObj = new URLSearchParams($searchStr);
  let _title = _searchObj.get('nickname') || '';
  let index = findIndexByTitle(_title);

  if (index !== -1 && urls[index].value !== $searchStr) {
    e.preventDefault();
    e.returnValue = '';
  }
});


function getItemTitle(item) {
  return `${getISOFormatedTime(item.time)}\x0A\x0A${decodeURIComponent(item.value).split('&').join('\x0A')}`;
}

</script>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<section class="urls-section hide-for-print">

  <button
    class="button footer-button save-btn"
    title={ $_('save') }
    on:click={ save }
  >
    💾
  </button>

  <div class="urls">

    <h3 class="mb-1">
       <span class="icon">💾</span> { $_('saved.items') }:
    </h3>

    <ul class="saved-items">
      {#each urls as savedItem (savedItem.time)}
        <li class="saved-item">

          <button class="delete-btn"
            on:click|preventDefault={ remove.bind(this, savedItem.title) }
          >
            ⨯
          </button>

          <a
            href="./?{ savedItem.value }"
            class="saved-item__link"
            class:active={ savedItem.title === $nickname }
            on:click|preventDefault={ apply.bind(this, savedItem.value) }
            title={ getItemTitle(savedItem) }
          >
            { savedItem.title }
          </a>

        </li>
      {/each}
    </ul>
  </div>

</section>




<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<style global>

.save-btn {
  left: calc(.5rem * 2 + var(--footer-btn-fz) * 2);
  visibility: visible;
}

.urls {
  overflow: auto;
}

.saved-item {
  display: flex;
  align-items: start;
  max-width: 70vw;
  margin-bottom: .5rem;
  list-style: none;
  white-space: pre-line;
}

.saved-item__link {
  color: var(--link-color-inactive);
  text-decoration: none;
  margin-left: .5rem;
  padding-left: .5em;
  word-break: break-word;
  border-left: 2px dotted transparent;

  &.active {
    color: var(--link-color);
    border-left-color: currentColor;
    border-left-color: inherit;
  }
}

.delete-btn {
  font-size: 12px;
  border-radius: 50%;
  padding: 0;
  width: 1.5em;
  height: 1.5em;
  flex-shrink: 0;
  color: #f99;
  border-color: transparent;
  box-shadow: 0 0 1px;
  background-color: transparent;
  font-weight: 900;
  cursor: pointer;
}

</style>
