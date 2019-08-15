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

// export function objToUrl(argument) {
//   return new URLSearchParams(deleteEmptyProp(params)).toString();
// }

// function deleteEmptyProp(obj) {
//   for (let prop in obj) {
//     if (!obj[prop]) {
//       delete obj[prop];
//     }
//   }
//   return obj;
// }
