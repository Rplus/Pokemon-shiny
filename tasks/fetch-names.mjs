import fs from 'fs';
import fetch from 'node-fetch';
import { outputJSON, writeFile } from './u.mjs';
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
	outputJSON(data, './src/assets/data/temp/name.raw.json');

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

	outputJSON(op, './src/assets/data/name.min.json', 0);
	outputJSON(op, './src/assets/data/name.src.json');

	let csv = Object.keys(op).map(_dex => ({
		_dex,
		...op[_dex]
	}));
	writeFile('./src/assets/data/name.csv', json2csv(csv));
})
