import fs from 'fs';
import { outputJSON, writeFile } from './u.js';
import { json2csv } from 'json-2-csv';

// const url = 'https://opensheet.elk.sh/13UreWc5Nq4yiLYvDRt2RyPWXsDx9y4pMWhSD0JsnHCw/shiny';

// let data = await fetch(url).then(r => r.json());
// outputJSON(data, './tasks/tmp/pm.raw.json');
// outputJSON(data, './tasks/tmp/pm.json');
// outputJSON(data, './tasks/tmp/pm.min.json', 0);

// let csv = Object.keys(data).map(_dex => ({
// 	_dex,
// 	...data[_dex],
// }));
// writeFile('./src/assets/data/pm.csv', json2csv(csv));

const csv_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRqze6d3Nb2RnkyuhIDHO7Cfcqm4aeo0bqOOMYlB0-RL5WfM9F-BWb4v8aFIAx-ORZzcx-Yuj3fZjgZ/pub?gid=1478754075&single=true&output=csv`;

let raw_csv = await fetch(csv_url).then(r => r.text());

writeFile('./src/assets/data/pm.csv', raw_csv);
