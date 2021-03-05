const fs = require('fs');

const outputJSON = (json = {}, fileName, jsonSpace = 2) => {
  let fileContent = JSON.stringify(json, null, jsonSpace);
  fs.writeFileSync(fileName, fileContent);
  console.log(`JSON saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
};

let pms = fs.readFileSync('./assets/pms.json', 'utf8');
let names = fs.readFileSync('./assets/name.json', 'utf8');

pms = JSON.parse(pms);
names = JSON.parse(names);

// remove dup & use 'en' fallback
for (var dex in names) {
  names[dex]
  for (var lang in names[dex]) {
    if (
      lang === 'Romaji' ||
      (lang !== 'en' && names[dex][lang] === names[dex].en)
    ) {
      delete names[dex][lang];
    }
  }
}

outputJSON(pms, './public/pms.json', 0);
outputJSON(names, './public/name.json', 0);
