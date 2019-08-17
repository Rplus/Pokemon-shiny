let elm = {};
let today = new Date();
elm.body = document.querySelector('body');
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
    return all;
  }, {});

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length >= targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

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


[].slice.call(document.querySelectorAll('[data-l10n]')).forEach(element => {
  let l10nID = element.dataset.l10n;
  element.dataset.l10nDone = '1';
  element.innerText = getL10n(l10nID);
});


function sortPM(a, b) {
  return (a.order || a.dex) - (b.order || b.dex);
}

let oTitle = document.title;
let nicknameMaxLength = 20;
function nickname(value) {
  var n = value || elm.nickname.innerText;
  document.title = n ? `✨ ${n} | ${oTitle}` : oTitle;
  if (value) {
    elm.nickname.innerText = value.slice(0, nicknameMaxLength);
  } else {
    return elm.nickname.innerText;
  }
}


let html = Object.values(pmsByFamily)
  .map(family => {
    let pmDom = family.pms
    .sort(sortPM)
    .map(pm => {
      if (!pm.shiny_released) { return; }
      let name = getName(pm.name);
      return (
        `
        <input
          type="checkbox"
          class="sr-only pm-checkbox"
          data-dex="${pm.dex}"
          data-id="${pm.id}"
          id="pm-${pm.id}"
        />
        <label
          class="pm"
          for="pm-${pm.id}"
          title="#${pm.dex} ${name}"
        >
          <div class="pm-info"
            data-dex="${pm.dex}"
            data-id="${pm.id}"
          >
            <div class="pm-img-box">
              <img
                class="pm-img pm-img--shiny"
                crossorigin="anonymous" importance="low" decoding="async"
                src="${getImgUrl(pm)}"
                alt="#${pm.dex} ${name}"
                loading="lazy"
              >
              <img
                class="pm-img pm-img--normal"
                crossorigin="anonymous" importance="low" decoding="async"
                src="${getImgUrl(pm, true)}"
                alt="#${pm.dex} ${name}"
                loading="lazy"
              >
            </div>
            <div class="pm-name">${name}</div>
            <div class="pm-mark"></div>
          </div>
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

  updateCheckboxState(pm, nextState[pm.dataset.state] || '1');

  let state = pm.dataset.state;

  updateCheckedState(id, state);
  updateState();
  updateSelectedCounter();
});


function updateCheckedState(id, state) {
  let _old = pmData.get(id);
  // there are many browser compatibility issue with spread syntax...
  pmData.set(
    id,
    Object.assign(
      {},
      _old,
      { state: state }
    )
  );
}

const checkboxState = {
  'none': {
    indeterminate: false,
    checked: false,
  },
  'registered': {
    indeterminate: true,
    checked: true,
  },
  'own': {
    indeterminate: false,
    checked: true,
  },

};

const nextState = {
  'none': 'registered',
  'registered': 'own',
  'own': 'none',
};

function updateCheckboxState(checkbox, newState) {
  checkbox.dataset.state = newState;
  checkbox.indeterminate = checkboxState[newState].indeterminate;
  checkbox.checked = checkboxState[newState].checked;
};

let pmData = new Map();
elm.checkboxs = [].slice.call(document.querySelectorAll('.pm-checkbox'));
[].slice.call(elm.checkboxs).forEach(checkbox => {
  let id = checkbox.dataset.id;
  pmData.set(id, {
    id,
    checkbox,
    state: 'none',
  });
});


elm.nickname = document.querySelector('.nickname');
elm.nickname.addEventListener('input', (e) => {
  if (nickname().length > nicknameMaxLength) {
    e.preventDefault();
    alert('Nickname max limitation: 20');
    nickname(elm.nickname.innerText);
  }
  updateState();
});


document.querySelector('.counter-total').dataset.number = pmData.size;
elm.registered = document.querySelector('.counter-registered');
elm.owns = document.querySelector('.counter-owns');

elm.header = document.querySelector('.header');
function updateShinyCounter() {
  let own = getOwnIndexArr().length;
  let registeredOnly = getRegisteredOnlyIndexArr().length;
  let registered = registeredOnly + own;

  elm.header.style.setProperty('--rate-owns', own / pmData.size);
  elm.header.style.setProperty('--rate-registered', registered / pmData.size);

  elm.owns.dataset.number = own;
  elm.registered.dataset.number = registered;
}


function getIndexArr(map, type) {
  return map.filter(i => (i[1].state === type)).map(i => i[1].id);
}

function getOwnIndexArr(_map) {
  return getIndexArr([...(_map || pmData).entries()], 'own');
}

function getRegisteredOnlyIndexArr(_map) {
  return getIndexArr([...(_map || pmData).entries()], 'registered');
}

function sortByNumber(a, b) {
  return a - b;
}

function deleteEmptyProperty(obj) {
  for (i in obj) {
    if (!obj[i] && obj.hasOwnProperty(i)) {
      delete obj[i];
    }
  }
  return obj;
}

let splitChar = '-';
function updateState() {
  let ownArray = getOwnIndexArr();
  let registeredArray = getRegisteredOnlyIndexArr().concat(ownArray).sort(sortByNumber);
  let show = document.querySelector('[name="show-switcher"]:checked').value.split('-')[1];

  let para = new URLSearchParams(deleteEmptyProperty({
    nickname: nickname() || '',
    own: ownArray.join(splitChar),
    dex: registeredArray.join(splitChar),
    show: show,
  }));

  history.pushState(null, null, `?${para.toString()}`);
  elm.getShortUrl.removeAttribute('href');
  updateShinyCounter();
}


function renderState() {
  // fix older para format
  if (!location.search && location.hash) {
    history.pushState(null, null, `?${location.hash.replace(/^\#/, '')}`);
  }
  let para = new URLSearchParams(location.search);

  nickname(para.get('nickname'));

  let ownDex = (para.get('own') || '').split(splitChar);
  let registeredDex = (para.get('dex') || '').split(splitChar);
  let show = (para.get('show') || '');
  let showTarget = document.querySelector(`#show-${show}`);
  if (showTarget) {
    document.querySelector(`#show-${show}`).checked = true
  }

  pmData.forEach((i) => {
    let isOwn = (ownDex.indexOf(i.id) !== -1);
    let isRegistered = (registeredDex.indexOf(i.id) !== -1);

    i.state = !isRegistered ? 'none' : ( isOwn ? 'own' : 'registered' );

    updateCheckboxState(i.checkbox, i.state);
  });

  updateShinyCounter();
  updateSelectedCounter();
}


function getImgUrl(pm, normal) {
  let pokedex = `${pm.dex}`.padStart(3, '0');
  let imgBasePath = 'https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/pokemon_icon_';
  // // for dev
  // let imgBasePath = './PogoAssets/pokemon_icons/pokemon_icon_';

  let number = `${pokedex}${pm.type || '_00'}${pm.isotope || ''}`;
  let shiny = normal ? '' : '_shiny';

  // return `https://images.weserv.nl/?w=200&il&url=${imgBasePath}${number}${shiny}.png${pm.cachebuster || ''}`;
  return `${imgBasePath}${number}${shiny}.png${pm.cachebuster || ''}`;
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
  return fetch(`https://cors-anywhere.herokuapp.com/http://tinyurl.com/api-create.php?url=${location.href}`).then(d => d.text());
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


// update time
fetch('./manifest.json').then(r => r.json()).then(r => {
  document.querySelector('.update').dataset.updatetime = r.update;
});

elm.selectAll = document.querySelector('.select-all');
elm.selectAll.addEventListener('click', (e) => {
  e.preventDefault();

  let targetState = !elm.selectAll.selected;

  pmData.forEach(pm => {
    if (targetState) {
      pm.state = (pm.state === 'none') ? 'registered' : pm.state;
    } else {
      pm.state = 'none';
    }
  });
  updateState();
  renderState();
  elm.selectAll.selected = !elm.selectAll.selected;
});


function updateSelectedCounter() {
  [].slice.call(document.querySelectorAll('.pm-group')).forEach(group => {
    let all = group.querySelectorAll('input').length;
    let checked = group.querySelectorAll('input:checked').length;
    let indeterminate = group.querySelectorAll('input:indeterminate').length;
    group.dataset.checked = checked + indeterminate;
    group.dataset.unchecked = all - (checked + indeterminate);
  });
};


elm.reset = document.querySelector('.reset');
elm.reset.addEventListener('click', (e) => {
  e.preventDefault();
  if (window.confirm(getL10n('confirm-to-reset'))) {
    location.href = './';
  }
});


[...document.querySelectorAll('[name="show-switcher"]')].forEach(e => {
  e.addEventListener('change', updateState);
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

elm.fbLikeDetails = document.querySelector('.fb-like-details');
elm.fbLikeDetails.addEventListener('toggle', () => {
  if (elm.fbLikeDetails.init) {
    return;
  }

  // https://developers.facebook.com/docs/plugins/like-button
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'))

  elm.fbLikeDetails.init = true;
});

