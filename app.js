let lang = navigator.language.slice(0, 2).toLowerCase();
document.documentElement.lang = navigator.language;

// l10n
function getL10n(l10nID) {
  return (
    (
      l10n[l10nID] && (
        l10n[l10nID][lang] || l10n[l10nID]['en']
      )
    ) || l10nID
  );
}

[].slice.call(document.querySelectorAll('[data-l10n]')).forEach(element => {
  let l10nID = element.dataset.l10n;
  element.dataset.l10nDone = '1';
  element.innerText = getL10n(l10nID);
});


let today = new Date();
let pmsByFamily = pms
  .filter(pm => {
    if (!pm.shiny_released && pm.released_date) {
      pm.shiny_released =  new Date(pm.released_date) < today;
    }
    return pm.shiny_released;
  })
  .reduce((all, pm) => {
    if (!all[pm.family]) {
      all[pm.family] = {
        key: pm.dex,
        pms: [],
        shiny: pm.shiny_released,
        family: pm.family,
      };
    }
    pm.id = `${pm.dex}${pm.type || ''}${pm.isotope || ''}`;
    all[pm.family].pms.push(pm);
    pm.name = getName(pm.name);
    pm.title = `#${pm.dex} ${pm.name}`;
    pm.bgi = `background-image: url(${getImgUrl(pm)});`;
    return all;
  }, {});


var groupedPMs = Object.values(pmsByFamily);
var allPM = groupedPMs.reduce((a, f) => a.concat(f.pms), []);


Vue.component('pm', {
  props: ['pm', 'state'],
  data () {
    return {
    };
  },
  watch: {
    state (o, n) {
      console.log(221, o, n);
    },
  },
  template: `
    <div class="pm">
      <div class="pm-info"
        :data-dex="pm.dex"
        :data-id="pm.id"
        :data-state="state"
        :style="pm.bgi"
        :title="pm.title"
        @click="$emit('update-count', pm)"
      >
        <div class="pm-name">
          {{ pm.name }}
        </div>
      </div>
    </div>
  `,
});

Vue.component('pm-group', {
  props: ['family'],
  computed: {
    selected () {
      var pms = this.family.pms;
      return this.family.pms.filter(pm => pm.state > 0).length;
    },
    unselected () {
      var all = this.family.pms.length;
      return all - this.family.pms.filter(pm => pm.state > 0).length;
    },
  },
  template: `
    <div
      class="pm-group"
      :data-selected="selected"
      :data-unselected="unselected"
    >
      <slot></slot>
    </div>`,
});

var vm = new Vue({
  el: '#app',

  data: {
    name: '',
    pmFamily: groupedPMs,
    printing: false,
    countTotal: allPM.length,
    countRegistered: 0,
    countOwned: 0,
    url: '',
    count: {
      owned: 0,
      registered: 0,
      total: allPM.length,
    },
  },

  created: function () {
    console.log('created');
    let para = new URLSearchParams(location.search);
    this.url = para.toString();
    this.name = para.get('nickname');

    let dexState = para.get('dex').split('-').reduce((output, dex) => {
      let [d, s] = dex.split('.');
      output[d] = s;
      return output;
    }, {});

    console.log(dexState);

    groupedPMs.forEach(group => {
      group.pms.forEach(pm => {
        let state = dexState[pm.id];
        if (state) {
          pm.state = state;
        }
      });
    });

    this.updateCount();
  },

  computed: {
    // countRegistered () {
    //   var data = this.pmFamily;
    //   return calcState(data, 'registered');
    //   // return this.pmFamily.reduce((sumAll, f) => {
    //   //   return (
    //   //     sumAll + f.pms.reduce((sum, pm) => sum + (pm.state === 'registered' ? 1 : 0), 0)
    //   //   );
    //   // }, 0);
    // },
    // countOwned () {
    //   return 123;
    // },
  },

  watch: {
    name() {
      this.updateUrl();
    },
  },

  methods: {
    updateCount (pm) {
      console.log(1233, 'updateCount', pm);
      var targetFamily;
      if (pm) {
        pm.state = ((pm.state || 0) + 1) % 3;
        targetFamily = this.pmFamily.find(f => f.family === pm.family);
      }

      let targetPms = flattenDeep(this.pmFamily.map(f => f.pms)).filter(pm => pm.state);
      let count = targetPms.reduce((out, pm) => {
        out[pm.state] = (out[pm.state] || 0) + 1;
        return out;
      }, {})

      this.count.owned = count[2] || 0;
      this.count.registered = count[1] || 0;

      if (targetFamily) {
        targetFamily.selected = targetFamily.pms.filter(pm => pm.state > 0).length;
        targetFamily.unselected = targetFamily.pms.length - targetFamily.selected;
      }
      this.updateUrl();
    },

    updateUrl() {
      console.log('updateUrl');
      let targetPms = flattenDeep(this.pmFamily.map(f => f.pms)).filter(pm => pm.state);
      console.log({targetPms});
      this.url = new URLSearchParams({
        nickname: this.name,
        dex: targetPms.map(pm => `${pm.id}.${pm.state}`).join('-'),
      }).toString();

      history.pushState(null, null, `?${this.url}`);
    },

    // saveAsImg: function () {
    //   updateOutput();
    //   this.printing = true;
    //   window.scrollTo(0, 0);

    //   setTimeout(() => {
    //     html2canvas(
    //       document.querySelector('.pm-group'), {
    //         // width: elm.workspace.clientWidth,
    //         // useCORS: true,
    //       }
    //     )
    //     .then(canvas => {
    //       updateOutput(canvas);
    //       this.printing = false;
    //     });
    //   }, 500);
    // },
  },
});


// utils
function getName(pmNames) {
  return pmNames[lang] || pmNames['en'];
}

function calcState(array, state) {
  return array.reduce(
    (sumArr, f) => (
      sumArr.concat(
        f.pms.reduce(
          (sum, pm) => {
            if (pm.state === state) {
              sum.push(pm.id);
            }
            return sum;
          }, []
        )
      )
    ),
    []
  );
}

function getImgUrl(pm) {
  let pokedex = `${pm.dex}`.padStart(3, '0');
  return `//images.weserv.nl/?w=200&il&url=raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/pokemon_icon_${pokedex}${pm.type || '_00'}${pm.isotope || ''}_shiny.png${pm.cachebuster || ''}`;
}

function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

// var elm = {};
// elm.workspace = document.querySelector('.workspace');
// elm.outputLink = document.querySelector('.output-link');
// elm.outputImg = document.querySelector('.output-img');

// function updateOutput(canvas) {
//   if (!canvas) {
//     elm.outputLink.href = '';
//     elm.outputImg.src = '';
//     return;
//   }

//   window.cc = canvas;
//   elm.outputImg.src = canvas.toDataURL('image/jpeg');
//   elm.outputLink.href = canvas.toDataURL('image/jpeg');
//   elm.outputLink.download = `${'my'}-shiny-w${canvas.width}.jpg`;
//   elm.outputLink.click();
// }
