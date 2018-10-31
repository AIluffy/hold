const request = require('request');
const fs = require('fs');
const os = require('os');
const ora = require('ora');

module.exports = function downloadPic(src, name, ext) {
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
			spinner.succeed(`placeholder pic success downloaded, check path ${downloadPath}`);
		});
};
