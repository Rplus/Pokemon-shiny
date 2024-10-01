import fs from 'fs';
import { outputJSON, writeFile } from './u.js';
import { json2csv } from 'json-2-csv';

const url = 'https://opensheet.elk.sh/13UreWc5Nq4yiLYvDRt2RyPWXsDx9y4pMWhSD0JsnHCw/shiny';

let data = await fetch(url).then(r => r.json());
outputJSON(data, './tasks/tmp/pm.raw.json');

outputJSON(data, './tasks/tmp/pm.json');
outputJSON(data, './tasks/tmp/pm.min.json', 0);

let csv = Object.keys(data).map(_dex => ({
	_dex,
	...data[_dex],
}));
writeFile('./src/assets/data/pm.csv', json2csv(csv));

