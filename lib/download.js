const request = require('request');
const fs = require('fs');
const os = require('os');
const ora = require('ora');
const upload = require('./upload');
const chalk = require('chalk');

// 命令行颜色常量
const success = chalk.bold.green;

module.exports = function downloadPic(src, name, ext, isUpload) {
	const downloadPath = os.platform() === 'win32' ? `${os.homedir()}\\Downloads\\` : `${os.homedir()}/Downloads/`;

	const spinner = new ora({
		text: 'downloading placeholder pic...',
		color: 'yellow'
	});

	spinner.start();

	request(src)
		.pipe(fs.createWriteStream(`${downloadPath}${name}.${ext}`))
		.on('error', function() {
			spinner.fail('placeholder pic fail download, try again!');
		})
		.on('close', function() {
			spinner.succeed(`placeholder pic ${src} success downloaded, check path ${downloadPath}`);

			if (!!isUpload) {
				const spinner2 = new ora({
					text: 'uploading placeholder pic...',
					color: 'yellow'
				});
			
				spinner2.start();
				upload(`${downloadPath}${name}.${ext}`)
					.then((body) => {
						if (body) {
							const json = JSON.parse(body)
							spinner2.succeed('upload success')
							console.log(success(`pic url is ${json.url}`))
						}
					})
			}
		});
};
