import fs from 'fs';

export function outputJSON(json = {}, fileName, jsonSpace = 2) {
  let fileContent = JSON.stringify(json, null, jsonSpace);
  writeFile(fileName, fileContent)
};

export function writeFile(fileName = '', fileContent = '') {
	fs.writeFileSync(fileName, fileContent);
  console.log('\x1b[46m%s\x1b[0m', `Data saved as ${fileName}! ( ${fileContent.length / 1000} kb )`);
}

export function getArgs() {
  return process.argv.slice(2).reduce((all, i) => {
    let pair = i.split('=');
    all[pair[0]] = pair[1];
    return all;
  }, {});
}

export function readJsonFile(filePath) {
  let content;
  try {
    // fs.unlinkSync(filename);
    content = fs.readFileSync(filePath, 'utf8');
    content = JSON.parse(content);
    return content;
  } catch (err) {
    // console.error(err.message);
    console.error(err);
    return null;
  }
}
