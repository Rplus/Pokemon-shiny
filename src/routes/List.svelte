<script>
import { getPM } from '../pms.js';
import { lang, langs, show, shows, dex } from '../stores.js';

let pmsByFamily = [];
let pmsMap = {};
let gotData = false;

// showsIndex for pm status.
// 0: pokedex, default
// 1: registered, 'reg'
// 2: in packages, 'own'
let showsIndex = shows.map((i, idx) => idx);
let showsLen = shows.length;

getPM()
.then(data => {
  gotData = true;
  pmsByFamily = data;

  $dex.trigger = null;
  delete $dex.trigger;

  window.pmsByFamily = pmsByFamily;
  console.log('got data', $dex);
});

function click(pmGroupIndex, pmIndex) {
  // this === pm
  pmsByFamily[pmGroupIndex].pms[pmIndex].status = (this.status + 1) % showsLen;
}

let updateStatus = () => {
  // reset status
  pmsByFamily.status = {};
  pmsByFamily.forEach(calcStatus);
  updateSearchParams();
};

function calcStatus(f) {
  f.status = f.pms.reduce((all, pm) => {
    let _status = pm.status;

    calcAllStatus(_status, pm.id);

    if (!all[_status]) {
      all[_status] = 0;
    }
    all[pm.status] += 1;
    return all;
  }, {});

  f.registered = (f.status[1] || 0) + (f.status[2] || 0);
  f.remain = f.pms.length - f.registered;
};

function calcAllStatus(_status, _id) {
  if (!pmsByFamily.status[_status]) {
    pmsByFamily.status[_status] = [];
  }
  pmsByFamily.status[_status].push(_id);
};

function updateSearchParams() {
  if (!gotData) { return; }
  let status = pmsByFamily.status;
  let _dex = {};
  console.log(showsIndex);
  for (let index in showsIndex) {
    if (index === '0') { continue; } // skip 'all: 0' status

    let key = showsIndex[index];
    _dex[shows[index]] = status[key] ? status[key].join('-') : null;
  }
  $dex = { ...$dex, ..._dex };
};

function applyDex(_dex) {
  console.log('applyDex', _dex);
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

<div>
Counter:
{#each Object.entries(pmsByFamily.status) as sAll}
【 { shows[sAll[0]] }/{ sAll[1].length } 】
{/each}
</div>

<hr>

<div class="pm-list" data-show="{ $show }">
  {#each pmsByFamily as pmGroup, pmGroupIndex}
  <div class="pm-group"
    data-family="{ pmGroup.family }"
    data-status0="{ pmGroup.status[0] || 0 }"
    data-registered="{ pmGroup.registered }"
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

<style global>
.pm-list {
  &[data-show="dex"] {
    --pm-display-all: none;
    --group-display-0: none;
  }

  &[data-show="own"] {
    --pm-display-all: none;
    --pm-display-dex: none;
    --group-display-0: none;
  }
  &[data-show="offer"] {
    --pm-display-all: none;
    --pm-display-dex: none;
    --pm-display-own: none;
    --group-display-0: none;
  }
}

.pm-list {
  background-color: #fff;
}

.pm {
  display: var(--pm-display-all, block);

  &[data-status="0"] { display: var(--pm-display-all, block); }
  &[data-status="1"] { display: var(--pm-display-dex, block); }
  &[data-status="2"] { display: var(--pm-display-own, block); }
  &[data-status="3"] { display: var(--pm-display-offer, block); }
}

.pm-group {
  border-bottom: 1px solid #000;

  &[data-registered="0"] {
    display: var(--group-display-0, block);
  }
}

.pm {
  display: var(--pm-display, block);
}

.saved-item {
  white-space: nowrap;
}
</style>
