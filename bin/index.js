#!/usr/bin/env node

const program = require('commander');
const downloadPic = require('../lib/download');
const chalk = require('chalk');

// 命令行颜色常量
const error = chalk.bold.red;

const colorRegx = /^((?:[0-9a-fA-F]{3}){1,2}|black|green|silver|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua)$/i; // 颜色名或hex类型色值
// 正则常量
const integerReg = /^([1-9]\d*)(\.\d*[1-9])?$/i; // 正整数

const getWidthHeight = (width, height) => {
	return height ? `${width}x${height}` : `${width}`;
};

// 命令行对象设置
program
	.version('0.0.1')
	.option('-g, --gif', 'set image gif extension')
	.option('-j, --jpg', 'set image jpg extension')
	.option('-J, --jpeg', 'set image jpeg extension')
	.option('-p, --png', 'set image png extension')
	.option('-b, --bg-color <bgColor>', 'set background color', colorRegx, '')
	.option('-c, --color [color]', 'set text color', colorRegx, '')
	.option('-t, --text [texture]', 'set image custom text, in the mode "a+b+c"', '')
	.arguments('<width> [height]')
	.action(function(width, height) {
		_width = width; // 宽度参数
		_height = height; // 高度参数
	})
	.parse(process.argv);

// // 图片宽度必传
if (typeof _width === 'undefined' || !_width) {
	console.log(error('**图片宽度未设置**'));
	process.exit(1);
}

// 判断图片宽度类型
if (!integerReg.test(_width)) {
	console.log(error('**请填写正确的图片宽度**'));
	process.exit(1);
}

// 判断图片高度类型
if (_height && !integerReg.test(_height)) {
	console.log(error('**请填写正确的图片高度**'));
	process.exit(1);
}

// option 选项
const { gif, png, jpeg, jpg } = program;

// 获取后缀
const getExt = () => {
	switch (true) {
		case gif:
			return 'gif';
		case png:
			return 'png';
		case jpeg:
			return 'jpeg';
		case jpg:
		default:
			return 'jpg';
	}
};

const ext = getExt(); // 后缀
const width_height = getWidthHeight(_width, _height);
const prefix = 'https://via.placeholder.com/'; // 前缀
const bgColor = program.bgColor;
const color = program.color;
const text = program.text;

let url = `${prefix}${width_height}.${ext}`;

// 背景色，文字颜色，文本组合情况
const b = bgColor ? 1 : 0,
	c = color ? 1 : 0,
	t = text ? 1 : 0;

const option = `${b}${c}${t}`;

switch (option) {
	case '000':
		break;
	case '100':
		url = `${url}/${bgColor}`;
		break;
	case '010':
		url = `${url}//${color}`;
		break;
	case '001':
		url = `${url}?text=${text}`;
		break;
	case '110':
		url = `${url}/${bgColor}/${color}`;
		break;
	case '101':
		url = `${url}/${bgColor}?text=${text}`;
		break;
	case '011':
		url = `${url}//${color}?text=${text}`;
		break;
	case '111':
		url = `${url}/${bgColor}/${color}?text=${text}`;
		break;
	default:
		break;
}

downloadPic(url, width_height, ext);
