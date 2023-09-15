import fs from 'fs';
import fetch from 'node-fetch';

const outputJSON = (json = {}, fileName, jsonSpace = 2) => {
	let fileContent = JSON.stringify(json, null, jsonSpace);
	fs.writeFileSync(fileName, fileContent);
	console.log(`JSON saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
};

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
		}
`
	})
})
.then(res => res.json())
.then(res => {
	let data = res.data.pokemon_v2_pokemonspecies;
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

	outputJSON(op, './assets/name.json');
})