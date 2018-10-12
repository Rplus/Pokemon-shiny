let elm = {};
let pmsByFamily = pms.reduce((all, pm) => {
  if (!all[pm.family]) {
    all[pm.family] = {
      key: pm.dex,
      pms: [],
      shiny: pm.shiny_released,
      family: pm.family,
    };
  }
  all[pm.family].pms.push(pm);
  return all;
}, {});


let totalShiny = 0;


let html = Object.values(pmsByFamily)
  .filter(family => family.pms[0].shiny_released)
  .map(family => {
    let pmDom = family.pms.map(pm => {
      totalShiny += 1;
      return (
        `<label class="pm"
          title="#${pm.dex} ${pm.name_en}"
          data-dex="${pm.dex}"
          data-name="${pm.name}"
          style="background-image: url(${getImgUrl(pm.dex)});">
            <input class="sr-only pm-checkbox" type="checkbox" data-dex="${pm.dex}" />
            <div class="pm-checkbox--fake"></div>
          </label>`
      );
    }).join('');

    return `<div class="pm-group">${pmDom}</div>`;
  }).join('');


let shinyDex = [];
elm.checkList = document.querySelector('.pm-checklist');
elm.checkList.innerHTML = html;
elm.checkList.addEventListener('change', (e) => {
  let pm = e.target;
  let dex = +pm.dataset.dex;
  let checked = pm.checked;

  shinyDex[dex] = pm.checked;
  updateState();
});


let checkboxArr = [];
elm.checkboxs = document.querySelectorAll('.pm-checkbox');
elm.checkboxs.forEach(checkbox => {
  checkboxArr[+checkbox.dataset.dex] = checkbox;
});


elm.nickname = document.querySelector('.nickname');
elm.nickname.addEventListener('input', updateState);


elm.counter = document.querySelector('.counter');
elm.counter.dataset.total = totalShiny;
function updateShinyCounter() {
  elm.counter.dataset.counter = getArrayIndex(shinyDex).length;
}


function getArrayIndex(arr) {
  return arr.map((i, v) => i ? v : i).filter(Boolean);
}

let splitChar = '-';
function updateState() {
  let para = new URLSearchParams({
    dex: getArrayIndex(shinyDex).join(splitChar),
    nickname: elm.nickname.value || '',
  });
  history.pushState(null, null, `?${para.toString()}`);
  updateShinyCounter();
}


function renderState() {
  let para = new URLSearchParams(location.search.replace(/^\?/, ''));

  let _nickname = para.get('nickname');
  elm.nickname.value = _nickname;

  let checkedDex = (para.get('dex') || '').split(splitChar).map(d => +d);
  checkboxArr.forEach((box, dex) => {
    let isChecked = (checkedDex.indexOf(dex) !== -1);
    box.checked = isChecked;
    shinyDex[dex] = isChecked;
  });
  updateShinyCounter();
}


function getImgUrl(dex) {
  return `//images.weserv.nl/?w=200&il&url=raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/pokemon_icon_${(dex + '').padStart(3, '0')}_00_shiny.png`;
}


elm.reset = document.querySelector('.reset');
elm.reset.addEventListener('click', () => {
  if (window.confirm('是否清空所選狀態？')) {
    location.search = '';
  }
});

window.addEventListener('popstate', renderState);
renderState();
