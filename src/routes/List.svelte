<script>
import { _ } from 'svelte-i18n';
import { getPM } from '../pms.js';
import {
  lang, langs,
  show, shows, showUnregistered,
  dex,
  pmTotalStatus,
  compareImg,
} from '../stores.js';

let pmsByFamily = [];
let pmsMap = {};
let gotData = false;

// showsIndex for pm status.
// 0: pokedex, default
// 1: registered, 'reg'
// 2: in packages, 'own'
// 3: offer-able, 'offer'
let showsIndex = shows.map((i, idx) => idx);
let showsLen = shows.length;
const defaultShowsCount = shows.map(i => 0);

window.$pmTotalStatus = () => {
  window.cc = $pmTotalStatus;
  console.log(cc);
};

getPM()
.then(data => {
  gotData = true;
  pmsByFamily = data;

  $dex.trigger = null;
  delete $dex.trigger;

  window.pmsByFamily = pmsByFamily;
});


function click(pmGroupIndex, pmIndex) {
  // this === pm
  pmsByFamily[pmGroupIndex].pms[pmIndex].status = (this.status + 1) % showsLen;
}


function updateStatus() {
  // reset status
  $pmTotalStatus = {};

  pmsByFamily.forEach(calcStatus);

  updateSearchParams();
};

function sumArray(arr) {
  return arr.reduce((all, i) => all + i);
}

function calcStatus(f) {
  f.status = f.pms.reduce((arr, pm) => {
    calcAllStatus(pm.status, pm.id);
    arr[pm.status] += 1;
    return arr;
  }, defaultShowsCount.slice());

  f.statusCount = f.status.reduce((all, i, idx) => {
    all[idx] = sumArray(f.status.slice(idx));
    return all;
  }, []);
};


function calcAllStatus(_status, _id) {
  if (!$pmTotalStatus[_status]) {
    $pmTotalStatus[_status] = [];
  }
  $pmTotalStatus[_status].push(_id);
};


function updateSearchParams() {
  if (!gotData) { return; }

  let status = $pmTotalStatus;
  let _dex = {};

  for (let index in showsIndex) {
    if (index === '0') { continue; } // skip 'all: 0' status

    let key = showsIndex[index];
    _dex[shows[index]] = status[key] ? status[key].join('-') : null;
  }

  $dex = { ...$dex, ..._dex };
};


function applyDex(_dex) {
  // console.log('applyDex', _dex);
  if (!gotData) { return; }

  let _map = {};
  showsIndex.forEach(index => {
    if (_dex[shows[index]]) {
      _dex[shows[index]].split('-').forEach(idx => {
        _map[idx] = index;
      });
    }
  });

  pmsByFamily.forEach((f, fi) => {
    f.pms.forEach((p, pi) => {
      p.status = _map[p.id] || 0;
    });
  });

  pmsByFamily.trigger = null;
  delete pmsByFamily.trigger;
}


$: {
  applyDex($dex);
}

$: {
  updateStatus(pmsByFamily);
}



function getImgSrc(fn, custom, normal) {
  let _fn = `pokemon_icon_${fn}${normal ? '' : '_shiny'}.png`;
  // let sourcePath = 'https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/';
  let sourcePath = 'https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/';
  if (location.hash.indexOf('#dev=') === 0) {
    return `${location.hash.split('=').pop()}${_fn}`;
  }
  return custom || `https://images.weserv.nl/?w=200&il&url=${sourcePath}${_fn}`;
}

</script>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<input type="checkbox" id="list-lock" class="list-lock sr-only">

<label
  for="list-lock"
  class="button footer-button list-lock-label hide-for-print"
  title={ $_('lock.list') }
/>

<div class="pm-list"
  data-show="{ $show }"
  class:show-unregistered={ $showUnregistered }
>
  {#each pmsByFamily as pmGroup, pmGroupIndex}
    <div class="pm-group"
      data-family="{ pmGroup.family }"
      data-count-unreg={ pmGroup.status[0] }
      data-count-reg={ pmGroup.statusCount[1] }
      data-count-own={ pmGroup.statusCount[2] }
      data-count-offer={ pmGroup.statusCount[3] }
    >
      {#each pmGroup.pms as pm, pmIndex}
        <div class="pm"
          data-id={ pm.id }
          data-dex={ pm.dex }
          data-status={ pm.status }
          title={ `#${pm.dex}` }
          on:click={ click.bind(pm, pmGroupIndex, pmIndex) }
        >
          <div class="pm-img-box">
            <img class="pm-img" alt="" src={ getImgSrc(pm.fn, pm.cfn1) } loading="lazy" width="200" height="200" intrinsicsize="120x120">
            {#if $compareImg}
              <img class="pm-img pm-img-n" alt="" src={ getImgSrc(pm.fn, pm.cfn0, true) } loading="lazy" width="200" height="200" intrinsicsize="120x120">
            {/if}
          </div>
          <div class="pm-name" data-dex={ pm.dex }>{ pm.name[$lang] }</div>
        </div>
      {/each}

    </div>
  {/each}
</div>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<style global>
.pm-list {
  width: 95%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  &[data-show="all"] {
  }

  &[data-show="dex"] {
    --pm-display-all: none;

    .pm-group[data-count-reg="0"] {
      --group-display: none;
    }
  }

  &[data-show="own"] {
    --pm-display-all: none;
    --pm-display-dex: none;

    .pm-group[data-count-own="0"] {
      --group-display: none;
    }
  }
  &[data-show="offer"] {
    --pm-display-all: none;
    --pm-display-dex: none;
    --pm-display-own: none;

    .pm-group[data-count-offer="0"] {
      --group-display: none;
    }
  }

  &.show-unregistered {
    --pm-display-all: block;
    --pm-display-dex: none;
    --pm-display-own: none;
    --pm-display-offer: none;

    .pm-group[data-count-unreg="0"] {
      --group-display: none;
    }
  }
}

.pm-group {
  --group-display-default: inline-flex;

  display: var(--group-display, var(--group-display-default));
  flex-wrap: wrap;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  font-size: 16px;
}

.pm {
  --pm-display-defalut: block;
  --bgc-a: 1;

  position: relative;
  display: var(--pm-display, var(--pm-display-defalut));
  width: 5em;
  height: 5em;
  width: 1em;
  height: 1em;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 5px;
  font-size: 5.5rem;
  font-size: calc(4.2rem + 5vmin);
  border-radius: .1em;
  border: 1px solid #ddd;
  background-color: hsla(33, 100%, 97%, var(--bgc-a));
  overflow: hidden;

  /* border */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    z-index: 5;
    border-radius: inherit;
    border: 3px solid;
    color: var(--bdc, transparent);
    pointer-events: none;
    /* background: var(--bgi, none) no-repeat 5% 95% / 13% 13%; */
  }

  /* marker */
  &::after {
    /* content: var(--marker, ''); */
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 4;
    width: .25em;
    height: .25em;
    background-color: var(--marker-color, var(--bdc));
    pointer-events: none;
    opacity: var(--mark-a, 0);
    transform: rotate(45deg) scaleX(1.5);
    transform-origin: 0% 0%;
  }

  &:not([data-status="0"]) {
    --bdc: hsl(60, 90%, 45%);
  }

  &[data-status="0"] {
    display: var(--pm-display-all, var(--pm-display-defalut));
    --bgc-a: 0;
  }

  &[data-status="1"] {
    display: var(--pm-display-dex, var(--pm-display-defalut));
  }

  &[data-status="2"] {
    display: var(--pm-display-own, var(--pm-display-defalut));
    --mark-a: 1;
  }

  &[data-status="3"] {
    display: var(--pm-display-offer, var(--pm-display-defalut));
    --mark-a: 1;
    /* icon author: Freepik
       licenses: CC 3.0 BY
       https://www.flaticon.com/authors/freepik
     */
    /* --bgi: url('data:image/svg+xml,%3Csvg height="683" viewBox="0 0 512 512" width="683" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill="%23CC471F" d="M20 512c-11 0-20-9-20-20v-32a326 326 0 0 1 328-328V40c0-16 10-31 25-37s32-3 43 9l98 97a60 60 0 0 1 0 85l-98 98a40 40 0 0 1-68-28v-22a20 20 0 0 1 40 0v22l98-98a20 20 0 0 0 0-28l-98-98v92c0 22-18 40-40 40A288 288 0 0 0 40 460v32c0 11-9 20-20 20zm348-248zm0 0"/%3E%3C/svg%3E'); */
    --marker-color: hsla(60, 80%, 35%, 1);
  }
}

.pm-img-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
  font-size: 1rem;
}

.pm-img {
  position: absolute;
  left: var(--l, 0%);
  top: var(--t, 0%);
  width: var(--w, 100%);
  height: var(--w, 100%);
  user-select: none;

  + .pm-img {
    opacity: 0;
    transition: opacity .3s;

    .pm:hover & {
      opacity: 1;
    }
  }
}

.pm-name {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  padding: .3em 8px 15px;
  text-align: left;
  border-radius: inherit;
  font-size: .9rem;
  line-height: 1;
  text-shadow: 1px 1px 0px #eef;
  color: #444;

  /* gradients tool: https://larsenwork.com/easing-gradients/ */
  background-image:
    linear-gradient(
      to bottom,
      hsla(0, 0%, 100%, 0.9) 0%,
      hsla(0, 0%, 100%, 0.889) 11.2%,
      hsla(0, 0%, 100%, 0.856) 21%,
      hsla(0, 0%, 100%, 0.806) 29.6%,
      hsla(0, 0%, 100%, 0.742) 37.1%,
      hsla(0, 0%, 100%, 0.667) 43.7%,
      hsla(0, 0%, 100%, 0.583) 49.6%,
      hsla(0, 0%, 100%, 0.495) 55%,
      hsla(0, 0%, 100%, 0.405) 60%,
      hsla(0, 0%, 100%, 0.317) 64.8%,
      hsla(0, 0%, 100%, 0.233) 69.6%,
      hsla(0, 0%, 100%, 0.158) 74.6%,
      hsla(0, 0%, 100%, 0.094) 80%,
      hsla(0, 0%, 100%, 0.044) 85.9%,
      hsla(0, 0%, 100%, 0.011) 92.5%,
      hsla(0, 0%, 100%, 0) 100%
    );

  @media (max-width: 700px) {
    font-size: .75rem;
  }

  &::before {
    position: absolute;
    top: 1.6em;
    content: '#' attr(data-dex);
    font-size: .8em;
    color:  rgba(0, 0, 0, .2);
    opacity: 0;

    .pm:hover & {
      opacity: 1;
    }
  }
}

.list-lock-label {
  left: 7.5rem;
  left: calc(.5rem * 3 + var(--footer-btn-fz) * 2 * 2);
  visibility: visible;

  .list-lock:checked + & {
    box-shadow: inset 1px 1px 2px #acc;
    background-color: var(--footer-btn-bgc-active);
  }

  &::before {
    content: '🔓';

    .list-lock:checked + & {
      content: '🔒';
    }
  }
}

.list-lock:checked ~ .pm-list {
  pointer-events: none;
}
</style>
