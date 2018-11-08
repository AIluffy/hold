#!/usr/bin/env node

// 引入
const program = require('commander');
const downloadPic = require('../lib/download');
const chalk = require('chalk');

// 命令行颜色常量
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

// 正则常量
const integerReg = /^([1-9]\d*|0)(\.\d*[1-9])?$/; // 正整数
const colorRegx = /^(#(?:[0-9a-fA-F]{3}){1,2}|black|green|silver|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua)$/; // 颜色名或hex类型色值

// 命令行对象设置
program
	.version('0.0.1')
	.option('-g, --gif', 'set image gif extension')
	.option('-j, --jpg', 'set image jpg extension')
	.option('-J, --jpeg', 'set image jpeg extension')
	.option('-p, --png', 'set image png extension')
	.option('-t, --text', 'set image custom text')
	.option('-b, --bgcolor', 'set background color')
	.option('-c, --color', 'set text color')
	.arguments('<width> [otherArgs...]')
	.action(function(width, otherArgs) {
		_width = width; // 宽度参数
		_otherArgs = otherArgs; // 其他参数
	});

program.parse(process.argv);

// option 选项
const { gif, png, jpeg, jpg, text, bgcolor, color } = program;

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

// 图片下载路由相关
let prefix = 'https://via.placeholder.com/', // 前缀
	name = `${_width}`, // 图片名
	ext = getExt(), // 图片类型
	len = _otherArgs.length; // 其他参数长度
downloadUrl = `${prefix}${name}.${ext}`; // 下载url

// 图片宽度必传
if (typeof _width === 'undefined' || !_width) {
	console.log(error('**请填写图片宽度**'));
	process.exit(1);
}

if (!integerReg.test(_width)) {
	console.log(error('**请填写正确的图片宽度**'));
	process.exit(1);
}

// 接收参数
const copyArgs = [..._otherArgs],
	arg0 = copyArgs[0],
	arg1 = copyArgs[1],
	arg2 = copyArgs[2];

// 背景色，文字颜色，文本组合情况
const b = program.bgcolor ? 1 : 0,
	c = program.color ? 1 : 0,
	t = program.text ? 1 : 0;

const option = `${b}${c}${t}`;

const getArgType = (arg = '') => {
	switch (true) {
		case integerReg.test(arg):
			return 'num';
		case colorRegx.test(arg):
			return 'color';
		default:
			return 'text';
	}
};

const genText = textArr => textArr.reduce((acc, cur) => `${acc}+${cur}`);

const actions = () => {
	return new Map([
		[
			/^000_num_?.*$/,
			() => {
				name = `${width}x${arg0}`;
			}
		],
		[
			/^000_(color|text)_?.*$/,
			() => {
				console.log(warning('存在冗余参数'));
			}
		],
		[
			/^001_num_?.*$/,
			() => {
				name = `${width}x${arg0}`;

				if (len > 1) {
					const restArgs = copyArgs.slice(1);
					const text = genText(restArgs);
					downloadUrl = `${prefix}${name}.${ext}?text=${text}`;
				}
			}
		],
		[
			/^001_(color|text)_?.*$/,
			() => {
				if (len > 1) {
					const text = genText(copyArgs);
					downloadUrl = `${prefix}${name}.${ext}?text=${text}`;
				} else {
					console.log(warning('未输入文本参数'));
				}
			}
		],
		[
			/^010_num_color_?.*$/,
			() => {
				name = `${width}x${arg0}`;
				downloadUrl = `${prefix}${name}.${ext}//${arg1}`;
			}
		],
		[
			/^(01|10)0_num_(num|text)_?.*$/,
			() => {
				name = `${width}x${arg0}`;
			}
		],
		[
			/^010_color_?.*$/,
			() => {
				downloadUrl = `${prefix}${name}.${ext}//${arg0}`;
			}
		],
		[
			/^(01|10)0_text_?.*$/,
			() => {
				console.log(warning('未输入颜色参数！'));
			}
		],
		[
			/^100_num_color_?.*$/,
			() => {
				name = `${width}x${arg0}`;
				downloadUrl = `${prefix}${name}.${ext}/${arg1}`;
			}
		],
		[
			/^100_color_?.*$/,
			() => {
				downloadUrl = `${prefix}${name}.${ext}/${arg0}`;
			}
		],
		[
			/^110_color_color_?.*$/,
			() => {
				downloadUrl = `${prefix}${name}.${ext}/${arg0}/${arg1}`;
			}
		],
		[
			/^110_color_(num|text)_?.*$/,
			() => {
				console.log(warning('缺失颜色参数，将下载仅配置背景图片！'));
				downloadUrl = `${prefix}${name}.${ext}/${arg0}`;
			}
		],
		[
			/^110_num_(num|text)_?.*$/,
			() => {
				console.log(warning('缺失颜色参数，将下载普通图片！'));
				name = `${width}x${arg0}`;
			}
		],
		[
			/^110_num_color_color_?.*$/,
			() => {
				name = `${width}x${arg0}`;
				downloadUrl = `${prefix}${name}.${ext}/${arg0}/${arg1}`;
			}
		],
		[
			/^110_num_color_(num|text)_?.*$/,
			() => {
				console.log(warning('缺失颜色参数，将下载仅配置背景图片！'));
				name = `${width}x${arg0}`;
				downloadUrl = `${prefix}${name}.${ext}/${arg1}`;
			}
		],
		[
			/^110_text_?.*$/,
			() => {
				console.log(warning('缺失颜色参数，将下载普通图片！'));
			}
		],
		[
			/^101_num_color_?.*$/,
			() => {
				name = `${width}x${arg0}`;
				if (len > 2) {
					const restArgs = copyArgs.slice(2);
					const text = genText(restArgs);
					downloadUrl = `${prefix}${name}.${ext}/${arg1}?text=${text}`;
				} else {
					downloadUrl = `${prefix}${name}.${ext}/${arg1}`;
				}
			}
		],
		[
			/^101_num_(text|num)_?.*$/,
			() => {
				console.log(warning('缺失颜色参数'));
				name = `${width}x${arg0}`;

				if (len > 1) {
					const restArgs = copyArgs.slice(1);
					const text = genText(restArgs);
					downloadUrl = `${prefix}${name}.${ext}?text=${text}`;
				}
			}
		],
		[
			/^101_color_?.*$/,
			() => {
				if (len > 1) {
					const restArgs = copyArgs.slice(1);
					const text = genText(restArgs);
					downloadUrl = `${prefix}${name}.${ext}/${arg0}?text=${text}`;
				}
			}
		],
		[
			/^101_text_?.*$/,
			() => {
				if (len > 0) {
					const text = genText(copyArgs);
					downloadUrl = `${prefix}${name}.${ext}?text=${text}`;
				}
			}
		],
		[
			/^011_num_color_?.*$/,
			() => {
				name = `${width}x${arg0}`;
				if (len > 2) {
					const restArgs = copyArgs.slice(2);
					const text = genText(restArgs);
					downloadUrl = `${prefix}${name}.${ext}//${arg1}?text=${text}`;
				} else {
					downloadUrl = `${prefix}${name}.${ext}//${arg1}`;
				}
			}
		],
		[
			/^011_num_(text|num)_?.*$/,
			() => {
				console.log(warning('缺失颜色参数'));
				name = `${width}x${arg0}`;

				if (len > 1) {
					const restArgs = copyArgs.slice(1);
					const text = genText(restArgs);
					downloadUrl = `${prefix}${name}.${ext}?text=${text}`;
				}
			}
		],
		[
			/^011_color_?.*$/,
			() => {
				if (len > 1) {
					const restArgs = copyArgs.slice(1);
					const text = genText(restArgs);
					downloadUrl = `${prefix}${name}.${ext}//${arg0}?text=${text}`;
				}
			}
		],
		[
			/^011_text_?.*$/,
			() => {
				if (len > 0) {
					const text = genText(copyArgs);
					downloadUrl = `${prefix}${name}.${ext}?text=${text}`;
				}
			}
		],
		[
			/^111_num_color_color_?.*$/,
			() => {
				name = `${width}x${arg0}`;

				downloadUrl = `${prefix}${name}.${ext}/${arg1}/${arg2}`;

				if (len > 3) {
					const restArgs = copyArgs.slice(3);
					const text = genText(restArgs);
					downloadUrl = `${downloadUrl}?text=${text}`;
				}
			}
		],
		[
			/^111_num_color_(text|num)_?.*$/,
			() => {
				name = `${width}x${arg0}`;

				console.log(warning('缺失颜色参数！'));
				downloadUrl = `${prefix}${name}.${ext}/${arg1}`;

				if (len > 2) {
					const restArgs = copyArgs.slice(2);
					const text = genText(restArgs);
					downloadUrl = `${downloadUrl}?text=${text}`;
				}
			}
		],
		[
			/^111_num_(text|num)_?.*$/,
			() => {
				name = `${width}x${arg0}`;

				console.log(warning('缺失颜色参数！'));
				downloadUrl = `${prefix}${name}.${ext}`;

				if (len > 1) {
					const restArgs = copyArgs.slice(1);
					const text = genText(restArgs);
					downloadUrl = `${downloadUrl}?text=${text}`;
				}
			}
		],
		[
			/^111_color_color_?.*$/,
			() => {
				downloadUrl = `${prefix}${name}.${ext}/${arg0}/${arg1}`;

				if (len > 2) {
					const restArgs = copyArgs.slice(2);
					const text = genText(restArgs);
					downloadUrl = `${downloadUrl}?text=${text}`;
				}
			}
		],
		[
			/^111_color_(num|text)_?.*$/,
			() => {
				console.log(warning('缺失颜色参数！'));
				downloadUrl = `${prefix}${name}.${ext}/${arg0}`;

				if (len > 1) {
					const restArgs = copyArgs.slice(1);
					const text = genText(restArgs);
					downloadUrl = `${downloadUrl}?text=${text}`;
				}
			}
		],
		[
			/^111_text_?.*$/,
			() => {
				console.log(warning('缺失颜色参数！'));

				if (len > 0) {
					const text = genText(copyArgs);
					downloadUrl = `${downloadUrl}?text=${text}`;
				}
			}
		]
	]);
};

const transformArgs = (option, otherArgs) => {
	if (len < 4) {
		for (let i = len; i <= 4; i++) {
			otherArgs.push('blank');
		}
	}

	return otherArgs.reduce((acc, cur) => {
		let curDesc = '';

		switch (true) {
			case integerReg.test(cur):
				curDesc = 'num';
				break;
			case colorRegx.test(cur):
				curDesc = 'color';
				break;
			default:
				curDesc = 'text';
		}

		return acc + '_' + curDesc;
	}, option);
};

const setDownLoadUrl = (option, otherArgs) => {
	let action = [...actions()].filter(([key, value]) => key.test(transformArgs(option, otherArgs)));

	action.forEach(([key, value]) => value.call(this));
};

setDownLoadUrl(option, otherArgs);

downloadPic(downloadUrl, name, ext);
