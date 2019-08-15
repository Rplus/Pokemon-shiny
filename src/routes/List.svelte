<script>
import { getPM } from '../pms.js';
import { lang, langs, show, shows, dex } from '../stores.js';

let pmsByFamily = [];

getPM()
.then(data => {
  pmsByFamily = data;
  window.pmsByFamily = pmsByFamily;
});

function click(pmGroupIndex, pmIndex) {
  // this === pm
  pmsByFamily[pmGroupIndex].pms[pmIndex].status = (this.status + 1) % 3;
}

let updateStatus = () => {
  pmsByFamily.status = {};
  pmsByFamily.forEach(calcStatus);
  // console.log('pmsByFamily.status', pmsByFamily.status);
  updateSearchParams(pmsByFamily.status);
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

  f.remain = f.pms.length - (f.status[1] || 0) - (f.status[2] || 0);
};

function calcAllStatus(_status, _id) {
  if (!pmsByFamily.status[_status]) {
    pmsByFamily.status[_status] = [];
  }
  pmsByFamily.status[_status].push(_id);
};

function updateSearchParams(status) {
  // 0: pokedex
  // 1: registered
  // 2: in packages
  let props = [1, 2];
  let _dex = {};
  for (let index in props) {
    let key = props[index];
    _dex[key] = status[key] ? status[key].join('-') : null;
  }
  $dex = { ...$dex, ..._dex };
};

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
    data-status-0="{ pmGroup.status[0] || 0 }"
    data-remain="{ pmGroup.remain }"
  >
    {#each pmGroup.pms as pm, pmIndex}
    <div class="pm" on:click={ click.bind(pm, pmGroupIndex, pmIndex) }>
      { pm.status } x { pm.id } x { pm.fn } { pm.name[$lang] }
    </div>
    {/each}

  </div>
  {/each}
</div>

<style global>
.pm-group {
  border-bottom: 1px solid #000;
}
</style>
