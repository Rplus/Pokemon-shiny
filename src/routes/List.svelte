<script>
import { _ } from 'svelte-i18n';
import { getPM } from '../pms.js';
import {
  lang, langs,
  show, shows, showUnregistered,
  dex,
  pmTotalStatus,
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


getPM()
.then(data => {
  gotData = true;
  pmsByFamily = data;

  $dex.trigger = null;
  delete $dex.trigger;

  // window.pmsByFamily = pmsByFamily;
});


function click(pmGroupIndex, pmIndex) {
  // this === pm
  pmsByFamily[pmGroupIndex].pms[pmIndex].status = (this.status + 1) % showsLen;
}


function updateStatus() {
  // reset status
  $pmTotalStatus = {};

  console.log($pmTotalStatus);

  pmsByFamily.forEach(calcStatus);

  updateSearchParams();
};

function sumArray(arr) {
  return arr.reduce((all, i) => all + i);
}

function calcStatus(f) {
  // f.status = f.pms.reduce((all, pm) => {
  //   let _status = pm.status;

  //   calcAllStatus(_status, pm.id);

  //   if (!all[_status]) {
  //     all[_status] = 0;
  //   }
  //   all[pm.status] += 1;
  //   return all;
  // }, {});

  f.status = f.pms.reduce((arr, pm) => {
    calcAllStatus(pm.status, pm.id);
    arr[pm.status] += 1;
    return arr;
  }, defaultShowsCount.slice());

  f.statusCount = f.status.reduce((all, i, idx) => {
    all[idx] = sumArray(f.status.slice(idx));
    return all;
  }, []);

  // console.log(f.status);
  // f.status = {...{ 0: 0, 1: 0, 2: 0, 3: 0 }, ...f.status};
  // console.log(Object.values(f.status));

  // f.statusCount = Object.entries(f.status).reduce((all, i) => {
  //   shows[i[0]]
  // }, {});

  // f.registered = (f.status[1] || 0) + (f.status[2] || 0);
  // f.remain = f.pms.length - f.registered;
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

</script>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->


<!--
<div>
Counter:
{#each Object.entries($pmTotalStatus) as sAll}
【 { shows[sAll[0]] }/{ sAll[1].length } 】
{/each}
</div>
-->


<input type="checkbox" id="list-lock" class="list-lock sr-only">
<label
  for="list-lock"
  class="button footer-button list-lock-label hide-for-print"
  title={ $_('lock.list') }
/>
<div class="pm-list" data-show="{ $show }" class:show-unregistered={ $showUnregistered }>
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
        data-status={ pm.status }
        on:click={ click.bind(pm, pmGroupIndex, pmIndex) }
      >
        { pm.status } x { pm.id } x { pm.fn } { pm.name[$lang] }
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
  background-color: #fff;

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

  outline: 1px solid #aaa;
}

.pm {
  --pm-display-defalut: block;

  position: relative;
  display: var(--pm-display, var(--pm-display-defalut));
  width: 5em;
  height: 5em;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 5px;
  border-radius: 10%;

  outline: 1px solid #aaa;

  &[data-status="0"] { display: var(--pm-display-all, var(--pm-display-defalut)); }
  &[data-status="1"] { display: var(--pm-display-dex, var(--pm-display-defalut)); }
  &[data-status="2"] { display: var(--pm-display-own, var(--pm-display-defalut)); }
  &[data-status="3"] { display: var(--pm-display-offer, var(--pm-display-defalut)); }
}

.saved-item {
  white-space: nowrap;
}


.list-lock-label {
  left: 7.5rem;
  visibility: visible;

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
