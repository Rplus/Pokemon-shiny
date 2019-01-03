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


  var allPM = Object.values(pmsByFamily).reduce((a, f) => a.concat(f.pms), []);


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
  data () {
    return {
      // selected: 0,
      // unselected: 0,
    }
  },
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
    pmFamily: Object.values(pmsByFamily),
    printing: false,
    countTotal: allPM.length,
    countRegistered: 0,
    countOwned: 0,
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
    pmFamily: {
      handler(cc) {
        console.log(1111111111111, cc);
      },
      deep: true
    },
  },

  methods: {
    updateCount (pm) {
      console.log(1233, pm);
      var targetFamily;
      if (pm) {
        pm.state = ((pm.state || 0) + 1) % 3;
        targetFamily = this.pmFamily.find(f => f.family === pm.family);
      }

      this.countOwned = calcState(this.pmFamily, 2);
      this.countRegistered = calcState(this.pmFamily, 1) + this.countOwned;

      if (targetFamily) {
        targetFamily.selected = targetFamily.pms.filter(pm => pm.state > 0).length;
        targetFamily.unselected = targetFamily.pms.length - targetFamily.selected;
      }
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
  return array.reduce((sumAll, f) => {
    return (
      sumAll + f.pms.reduce((sum, pm) => sum + (pm.state === state ? 1 : 0), 0)
    );
  }, 0);
}

function getImgUrl(pm) {
  let pokedex = `${pm.dex}`.padStart(3, '0');
  return `//images.weserv.nl/?w=200&il&url=raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/pokemon_icon_${pokedex}${pm.type || '_00'}${pm.isotope || ''}_shiny.png${pm.cachebuster || ''}`;
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
