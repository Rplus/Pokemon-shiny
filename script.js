let elm = {};
elm.body = document.querySelector('body');
let pmsByFamily = pms.reduce((all, pm) => {
  if (!all[pm.family]) {
    all[pm.family] = {
      key: pm.dex,
      pms: [],
      shiny: pm.shiny_released,
      family: pm.family,
    };
  }
  pm.id = `${pm.dex}${pm.isotope || ''}`;
  all[pm.family].pms.push(pm);
  return all;
}, {});


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

function getName(pmNames) {
  return pmNames[lang] || pmNames['en'];
}


document.querySelectorAll('[data-l10n]').forEach(element => {
  let l10nID = element.dataset.l10n;
  element.dataset.l10nDone = '1';
  element.innerText = getL10n(l10nID);
});


function sortPM(a, b) {
  return (a.order || a.dex) - (b.order || b.dex);
}


function nickname(value) {
  if (value) {
    elm.nickname.innerText = value;
  } else {
    return elm.nickname.innerText;
  }
}


let html = Object.values(pmsByFamily)
  .filter(family => family.pms[0].shiny_released)
  .map(family => {
    let pmDom = family.pms
    .sort(sortPM)
    .map(pm => {
      if (!pm.shiny_released) { return; }
      let name = getName(pm.name);
      return (
        `<label
          class="pm"
          title="#${pm.dex} ${name}"
        >
          <input
            type="checkbox"
            class="sr-only pm-checkbox"
            data-dex="${pm.dex}"
            data-id="${pm.id}"
          />
          <div class="pm-info"
            data-dex="${pm.dex}"
            data-name="${name}"
            style="background-image: url(${getImgUrl(pm.dex, pm.isotope)});"
          ></div>
        </label>`
      );
    }).join('');

    return `<div class="pm-group">${pmDom}</div>`;
  }).join('');


elm.checkList = document.querySelector('.pm-checklist');
elm.checkList.innerHTML = html;
elm.checkList.addEventListener('change', (e) => {
  let pm = e.target;
  let id = pm.dataset.id;
  let dex = pm.dataset.dex;
  let checked = pm.checked;

  updateCheckedState(id, checked);
  updateState();
});


function updateCheckedState(id) {
  let _old = pmData.get(id);
  pmData.set(id, {
    ..._old,
    ...{
      checked: _old.checkbox.checked
    }
  });
}

function onCheckboxClick(event) {
  let checkbox = event.target,
    state = checkbox.dataset.state || '0';

  if (state === '0') {
    checkbox.dataset.state = '1';

    checkbox.indeterminate = true;
    checkbox.checked = true;
  }
  else if (state === '1') {
    checkbox.dataset.state = '2';

    checkbox.indeterminate = false;
    checkbox.checked = true;
  }
  else {
    checkbox.dataset.state = '0';

    checkbox.indeterminate = false;
    checkbox.checked = false;
  }
}

let pmData = new Map();
elm.checkboxs = document.querySelectorAll('.pm-checkbox');
elm.checkboxs.forEach(checkbox => {
  let id = checkbox.dataset.id;
  pmData.set(id, {
    id,
    checkbox,
    checked: checkbox.checked
  });

  checkbox.addEventListener('click', onCheckboxClick);
});


elm.nickname = document.querySelector('.nickname');
elm.nickname.addEventListener('input', updateState);


document.querySelector('.counter [data-total]').dataset.total = pmData.size;
elm.counter = document.querySelector('.counter [data-counter]');
elm.owns = document.querySelector('.counter [data-owns]');

function updateShinyCounter() {
  let checked = getCheckedIndexArr(pmData).length,
    indeterminate = getIndeterminateIndexArr(pmData).length;

  elm.owns.dataset.owns = (checked - indeterminate);
  elm.counter.dataset.counter = checked;
}


function getCheckedIndexArr(_map) {
  return [...(_map || pmData).entries()].filter(i => i[1].checked).map(i => i[1].id);
}

function getIndeterminateIndexArr(_map) {
  return [...(_map || pmData).entries()].filter(i => i[1].checkbox.indeterminate).map(i => i[1].id);
}

let splitChar = '-';
function updateState() {
  let para = new URLSearchParams({
    dex: getCheckedIndexArr().join(splitChar),
    reg: getIndeterminateIndexArr().join(splitChar),
    nickname: nickname() || '',
  });
  history.pushState(null, null, `?${para.toString()}`);
  elm.getShortUrl.removeAttribute('href');
  updateShinyCounter();
}


function renderState() {
  let para = new URLSearchParams(location.search);

  nickname(para.get('nickname'));

  let checkedDex = (para.get('dex') || '').split(splitChar),
    indeterminateDex = (para.get('reg') || '').split(splitChar);

  pmData.forEach((i) => {
    let isChecked = (checkedDex.indexOf(i.id) !== -1),
      isIndeterminate = (indeterminateDex.indexOf(i.id) !== -1);

    i.checkbox.checked = isChecked;
    i.checkbox.indeterminate = isIndeterminate;
    i.checked = isChecked;

    if (isIndeterminate && isChecked)
      i.checkbox.dataset.state = '1';
    else if (!isIndeterminate && isChecked)
      i.checkbox.dataset.state = '2';
    else
      i.checkbox.dataset.state = '0';
  });

  updateShinyCounter();
}


function getImgUrl(dex, isotope) {
  let pokedex = `${dex}`.padStart(3, '0');
  return `//images.weserv.nl/?w=200&il&url=raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/pokemon_icon_${pokedex}_00${isotope || ''}_shiny.png`;
}


elm.share = document.querySelector('.share');
elm.share.addEventListener('click', (e) => {
  e.preventDefault();
  shareLink();
});

function toggleFectingClass() {
  elm.getShortUrl.classList.toggle('is-fetching');
}

elm.getShortUrl = document.querySelector('.get-shorturl');
elm.getShortUrl.addEventListener('click', (e) => {
  e.preventDefault();
  if (elm.getShortUrl.classList.contains('is-fetching')) {
    return;
  }
  let url = elm.getShortUrl.href;
  if (url) {
    shareLink(url);
    return;
  }

  toggleFectingClass();
  getShortedUrl()
  .then(d => {
    toggleFectingClass();
    elm.getShortUrl.href = d;
  })
  .catch(() => {
    toggleFectingClass();
  });
});

function getShortedUrl() {
  return fetch(`https://script.google.com/macros/s/AKfycbzpbnnYoIv28lkcezbaj170ot7nNkHZMUvI7FI5UBUaQrdD3Kw/exec?url=${encodeURIComponent(location.href)}`).then(d => d.text());
}

function shareLink(url) {
  url = url || location.href;
  let title = 'Pokemon Shiny Checklist';
  let who = 'my';
  if (nickname()) {
    who = `${nickname()}'s`;
    title = `${nickname()}'s ${title}`;
  }
  if (!navigator.share) {
    window.prompt(getL10n('share-url-directly'), url);
    return;
  }


  navigator.share({
    title: title,
    text: `Here are ${who} shiny pokemon.`,
    url: url,
  });
}


elm.reset = document.querySelector('.reset');
elm.reset.addEventListener('click', (e) => {
  e.preventDefault();
  if (window.confirm(getL10n('confirm-to-reset'))) {
    location.href = './';
  }
});

window.addEventListener('popstate', renderState);
renderState();



elm.workspace = document.querySelector('.workspace');
elm.outputLink = document.querySelector('.output-link');
elm.outputImg = document.querySelector('.output-img');
elm.saveAsImg = document.querySelector('#save-as-img');

elm.saveAsImg.addEventListener('click', () => {
  updateOutput();
  elm.body.classList.add('print');
  window.scrollTo(0, 0);

  setTimeout(() => {
    html2canvas(
      elm.workspace, {
        width: elm.workspace.clientWidth,
        useCORS: true,
      }
    )
    .then(canvas => {
      updateOutput(canvas);
      elm.body.classList.remove('print');
    });
  }, 200);
});

function updateOutput(canvas) {
  if (!canvas) {
    elm.outputLink.href = '';
    elm.outputImg.src = '';
    return;
  }

  window.cc = canvas;
  elm.outputImg.src = canvas.toDataURL('image/jpeg');
  elm.outputLink.href = canvas.toDataURL('image/jpeg');
  elm.outputLink.download = `${nickname() || 'my'}-shiny-w${canvas.width}.jpg`;
  elm.outputLink.click();
}

elm.outputWidth = document.querySelector('#output-width');
elm.outputWidth.value = elm.workspace.clientWidth;
document.querySelector('#reset-output-width').addEventListener('click', (e) => {
  e.preventDefault();
  elm.outputWidth.value = elm.workspace.clientWidth;
  updateOutputWidth();
});

document.querySelector('#set-output-width').addEventListener('click', (e) => {
  e.preventDefault();
  let width = Math.min(
    elm.outputWidth.max,
    Math.max(elm.outputWidth.min, elm.outputWidth.value)
  );
  elm.outputWidth.value = width;
  updateOutputWidth(width);
});


function updateOutputWidth(width) {
  if (!width) {
    elm.workspace.removeAttribute('style');
    return;
  }
  elm.workspace.style.width = `${width}px`;
}
