import fs from 'fs';
// import fetch from 'node-fetch';
import { outputJSON, writeFile } from './u.js';
import { json2csv } from 'json-2-csv';

const langs = [
	'ko',
	'zh-Hant',
	'fr',
	'de',
	'es',
	'it',
	'en',
	'ja',
];

fetch('https://beta.pokeapi.co/graphql/v1beta', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},

	body: JSON.stringify({
		query: `{
			pokemon_v2_pokemonspecies {
				id
				pokemon_v2_pokemonspeciesnames {
					name
					pokemon_v2_language {
						id
						name
					}
				}
			}
		}`
	})
})
.then(res => res.json())
.then(res => {
	let data = res.data.pokemon_v2_pokemonspecies;
	outputJSON(data, './tasks/tmp/name.raw.json');

	let op = data.reduce((all, pm) => {
		all[pm.id] = pm.pokemon_v2_pokemonspeciesnames.reduce((names, lang) => {
			let _lang = lang.pokemon_v2_language.name;
			if (langs.includes(_lang)) {
				names[_lang.split('-')[0]] = lang.name;
			}
			return names;
		}, {});
		return all;
	}, {});

	outputJSON(op, './tasks/tmp/name.min.json', 0);
	outputJSON(op, './tasks/tmp/name.src.json');

	let csv = Object.keys(op).map(dex => ({
		dex,
		...op[dex],
	}));
	writeFile('./src/assets/data/name.csv', json2csv(csv));
})
