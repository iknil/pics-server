const crypto = require('crypto');
const fs = require('fs');

function getHash(content, encoding, type) {
	return crypto.createHash(type).update(content, encoding).digest('hex');
}

function getHashOfFile(filePath) {
	return getHash(fs.readFileSync(filePath, 'utf8'), 'utf8', 'md5');
}

module.exports = {
	getHash,
	getHashOfFile
}