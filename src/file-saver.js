const fs = require('fs');
const { getHashOfFile } = require('./utils');

function pad(number) {
	if (number < 0) {
		return `0${number}`;
	}
	return `${number}`
}

function fileSaver(toDir, from, type) {
	const hash = getHashOfFile(from);
	const name = `${hash}.${type}`;
	const now = new Date();
	const ttoDir = `${toDir}/${now.getFullYear()}_${pad(now.getMonth())}_${pad(now.getDate())}`;
	if (!fs.existsSync(ttoDir)) {
		fs.mkdirSync(ttoDir);
	}
	const to = `${ttoDir}/${name}`;


	fs.writeFileSync(to, fs.readFileSync(from));
	return `${now.getFullYear()}_${pad(now.getMonth())}_${pad(now.getDate())}.${hash}`; // return name
}

module.exports = fileSaver;