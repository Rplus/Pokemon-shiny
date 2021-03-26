const STORAGE_KEY = 'Shiny-List';
export function saveItem(data) {
  if (!data || !data.key) { return false;}
  let odata = getItem() || {};

  odata[data.key] = data.value;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(odata));
};

export function getItem(key) {
  let data = localStorage.getItem(STORAGE_KEY);
  if (!data) { return null; }
  data = JSON.parse(data);

  return key ? data[key] : data;
};

export function getISOFormatedTime() {
  let now = new Date();
  return new Date(+now - now.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
}

export function isDev() {
  return location.hostname === 'localhost';
}

export function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export function throttle(callback, limit = 300) {
  var wait = false;
  return function (...args) {
    if (!wait) {
      callback(...args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  }
}

export const updateColor = debounce((colors) => {
  document.documentElement.style.setProperty('--root-bdc', colors[0]);
  document.documentElement.style.setProperty('--root-marker-color', colors[1]);
})
