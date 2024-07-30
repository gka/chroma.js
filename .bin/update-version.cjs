// update-version.js
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const versionFilePath = path.join(__dirname, '../src', 'version.js');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const versionFileContent = `// this gets updated automatically\nexport const version = '${version}';\n`;

fs.writeFileSync(versionFilePath, versionFileContent);

console.log(`Updated version to ${version} in ${versionFilePath}`);