<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // import { historeUrls, savedUrl } from '../stores.js';
  // import { getPmName, urlCoCoCo, getPM } from './u.js';

  function applyUrl(p) {
    dispatch('apply', {
      url: p,
    });
  }

  function itemTitle(url) {
    let o = urlCoCoCo(url);
    let n = getPmName(getPM(o.uid).ddex, o.lang);
    return [n, ...url.split('&')].map(i => {
      let ii = i.split('=').reverse();

      return `<span class="i ib">
        <sup>${ii[1] || ''}</sup>
        ${ii[0] || ''}
      </span>`
    }).join('')
  }
</script>

urlss~~~
