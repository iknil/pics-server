const express = require('express');
const basicAuth = require('express-basic-auth');
const formidable = require("formidable");
const fs = require('fs');
const sharp = require('sharp');
const os = require('os');
const path = require('path');
const fileSaver = require('./src/file-saver');

const tmpdir = os.tmpdir();
const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

app.use(/^\/(?!imgs).*/, basicAuth({
	users: { 'admin': process.env.PASSWORD ?  process.env.PASSWORD : '12345678' },
	challenge: true
}));

app.post('/api/upload', (req, res, next) => {
	const form = new formidable.IncomingForm();

	form.parse(req, (error, fields, data) => {
		let xerror = error;
		const result = [];
		try {
			for (let i = 0; i < data.files.length; i += 1) {
				const file = data.files[i];

				if (['image/jpeg', 'image/png', 'image/gif', 'image/avif'].indexOf(file.mimetype) >= 0) {
					const tarr = file.originalFilename.split('.');
					const id = fileSaver('./imgs', file.filepath, tarr[tarr.length - 1]);
					result.push({
						originalName: file.originalFilename,
						fileId: id
					});
				}
			}
		} catch (e) {
			xerror = e;
		}

		if (xerror) {
			next(xerror);
		} else {
			res.send({
				message:'上传成功',
				data: result
			});
		}
	});
});

app.get('/imgs/:id', (req, res) => {
	const [ dir, id, width, height, quality, fileType ] = req.params.id.split('.');
	let name = id;
	let files = [];
	let file = '';
	// 判断文件是否存在
	if (fs.existsSync(`imgs/${dir}`)) {
		try {
			files = fs.readdirSync(`imgs/${dir}`);
			// find
			for (let i = 0; i < files.length; i += 1) {
				if (files[i].indexOf(id) === 0) {
					file = files[i];
					break;
				}
			}

			// support webp jpeg png
			if (file === '' || ['webp', 'jpeg', 'png', 'gif', 'avif'].indexOf(fileType) === -1) {
				throw new Error('file not existed');
			}
		} catch (e) {
			res.sendStatus(404);
			return;
		}
	} else {
		res.sendStatus(404);
		return;
	}

	const imgtmpdir = path.join(tmpdir, './picstmp');
	if (!fs.existsSync(imgtmpdir)) {
		fs.mkdirSync(imgtmpdir);
	}

	const twidth = Number(width || 0);
	const theight = Number(height || 0);
	const tquality = Number(quality || 100);
	const tfileType = fileType.toLowerCase();

	name += `.${twidth}.${theight}.${tquality}.${tfileType}`;
	const toFile = path.join(imgtmpdir, name);
	const period = 60 * 60 * 24 * 30; // 30 days
	res.set('Cache-control', `public, max-age=${period}`);

	if (fs.existsSync(toFile)) {
		res.sendFile(toFile);
		return;
	}

	const instance = sharp(`imgs/${dir}/${file}`)
		.resize(twidth === 0 ? null : twidth, theight === 0 ? null : theight);

	switch (tfileType) {
		case 'webp':
			instance.webp({
				quality: tquality
			});
			break;
		case 'jpeg':
			instance.jpeg({
				quality: tquality
			});
			break;
		case 'png':
			instance.png({
				quality: tquality
			});
			break;
		case 'gif':
			instance.gif({
				quality: tquality
			});
			break;
		case 'avif':
			instance.avif({
				quality: tquality
			});
			break;
		default:
			instance.jpeg({
				quality: tquality
			});
			break;
	}

	instance.toFile(toFile).then(() => {
		res.sendFile(toFile);
	});
})

app.use('/', express.static('static'));

app.listen(port, () => {

});