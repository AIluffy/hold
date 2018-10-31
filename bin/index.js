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

// metods
const getExt = program => {
	let _ext = '';

	switch (true) {
		case program.gif:
			_ext = 'gif';
			break;
		case program.png:
			_ext = 'png';
			break;
		case program.jpeg:
			_ext = 'jpeg';
			break;
		case program.jpg:
			_ext = 'jpg';
			break;
		default:
			_ext = 'jpg';
			break;
	}

	return _ext;
};

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

// 图片下载路由相关
let prefix = 'https://via.placeholder.com/', // 前缀
	name = `${_width}`, // 图片名
	ext = getExt(program), // 图片类型
	len = _otherArgs.length; // 其他参数长度
downloadUrl = `${prefix}${name}.${ext}`; // 下载url

// 图片宽度必传
if (typeof _width === 'undefined' || !_width) {
	console.log(error('**请填写图片宽度**'));
	process.exit(1);
}

// 接收参数
const copyArgs = [..._otherArgs],
	arg0 = copyArgs[0],
	arg1 = copyArgs[1],
	arg2 = copyArgs[2],
	arg3 = copyArgs[3];

// 背景色，文字颜色，文本组合情况
const b = program.bgcolor ? 1 : 0,
	c = program.color ? 1 : 0,
	t = program.text ? 1 : 0;

const option = `${b}${c}${t}`;

const opt1Arg = () => {
	if (integerReg.test(arg0)) {
		name = `${width}x${arg0}`;
		downloadUrl = `${prefix}${name}.${ext}`; // 下载url
		option !== '000' && console.log(warning('仅填写图片长度，请注意其它参数'));
	} else {
		switch (option) {
			case '000':
				console.log(warning('第二个参数无效'));
				break;
			case '001':
				downloadUrl = `${downloadUrl}?text=${arg0}`;
				break;
			case '100':
			case '010':
			case '110':
				if (!colorRegx.test(arg0)) {
					console.log(error('第二个参数非有效颜色'));
					process.exit(1);
				}

				downloadUrl = option === '010' ? `${downloadUrl}//${arg0}` : `${downloadUrl}/${arg0}`;
				break;
			case '101':
			case '011':
			case '111':
				if (!colorRegx.test(arg0)) {
					downloadUrl = `${downloadUrl}?text=${arg0}`;
				} else {
					downloadUrl = option === '011' ? `${downloadUrl}//${arg0}` : `${downloadUrl}/${arg0}`;
				}

				break;
		}
	}
};

const opt2Arg = () => {
	if (integerReg.test(arg0)) {
		name = `${width}x${arg0}`;

		switch (option) {
			case '110':
				if (colorRegx.test(arg1)) {
					downloadUrl = `${downloadUrl}/${arg1}`;
				} else {
					console.log(error('第二个参数有误，请检查'));
				}
				break;
			case '011':
				if (colorRegx.test(arg1)) {
					downloadUrl = `${downloadUrl}//${arg1}`;
				} else {
					downloadUrl = `${downloadUrl}?text=${arg1}`;
				}
				break;
			case '101':
			case '111':
				if (colorRegx.test(arg1)) {
					downloadUrl = `${downloadUrl}/${arg1}`;
				} else {
					downloadUrl = `${downloadUrl}?text=${arg1}`;
				}
				break;
		}
	} else {
		switch (option) {
			case '110':
				if (colorRegx.test(arg0) && colorRegx.test(arg1)) {
					downloadUrl = `${downloadUrl}/${arg0}/${arg1}`;
				} else {
					if (colorRegx.test(arg0)) {
						downloadUrl = `${downloadUrl}/${arg0}`;
					}

					if (colorRegx.test(arg1)) {
						downloadUrl = `${downloadUrl}/${arg1}`;
					}
				}
				break;
			case '011':
				if (colorRegx.test(arg0)) {
					downloadUrl = `${downloadUrl}//${arg0}?text=${arg1}`;
				} else {
					downloadUrl = `${downloadUrl}?text=${arg0}+${arg1}`;
				}
				break;
			case '101':
				if (colorRegx.test(arg0)) {
					downloadUrl = `${downloadUrl}/${arg0}?text=${arg1}`;
				} else {
					downloadUrl = `${downloadUrl}?text=${arg0}+${arg1}`;
				}
				break;
			case '111':
				if (colorRegx.test(arg0)) {
					if (colorRegx.test(arg1)) {
						downloadUrl = `${downloadUrl}/${arg0}/${arg1}`;
					} else {
						downloadUrl = `${downloadUrl}/${arg0}?text=${arg1}`;
					}
				} else {
					if (colorRegx.test(arg1)) {
						downloadUrl = `${downloadUrl}//${arg1}?text=${arg0}`;
					} else {
						downloadUrl = `${downloadUrl}?text=${arg0}+${arg1}`;
					}
				}
				break;
		}
	}
};

const opt3Arg = () => {
	let _text = '';
	let rest = [];

	if (integerReg.test(arg0)) {
		name = `${width}x${arg0}`;

		switch (option) {
			case '001':
				rest = _otherArgs.slice(2);
				_text = rest.reduce((accumulator, currentValue) => {
					return accumulator + '+' + currentValue;
				}, arg1);

				downloadUrl = `${downloadUrl}?text=${_text}`;
				break;
			case '011':
				if (colorRegx.test(arg1)) {
					rest = _otherArgs.slice(3);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg2);

					downloadUrl = `${downloadUrl}/${arg1}?text=${_text}`;
				} else {
					rest = _otherArgs.slice(2);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg1);

					downloadUrl = `${downloadUrl}?text=${_text}`;
				}

				break;
			case '101':
				if (colorRegx.test(arg1)) {
					rest = _otherArgs.slice(3);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg2);

					downloadUrl = `${downloadUrl}//${arg1}?text=${_text}`;
				} else {
					rest = _otherArgs.slice(2);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg1);

					downloadUrl = `${downloadUrl}?text=${_text}`;
				}
			case '111':
				if (colorRegx.test(arg1)) {
					if (colorRegx.test(arg2)) {
						rest = _otherArgs.slice(4);
						_text = rest.reduce((accumulator, currentValue) => {
							return accumulator + '+' + currentValue;
						}, arg3);

						downloadUrl = `${downloadUrl}/${arg1}/${arg2}?text=${_text}`;
					} else {
						rest = _otherArgs.slice(3);
						_text = rest.reduce((accumulator, currentValue) => {
							return accumulator + '+' + currentValue;
						}, arg2);

						downloadUrl = `${downloadUrl}/${arg1}?text=${_text}`;
					}
				} else {
					rest = _otherArgs.slice(2);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg1);

					downloadUrl = `${downloadUrl}?text=${_text}`;
				}
				break;
		}
	} else {
		switch (option) {
			case '001':
				rest = _otherArgs.slice(1);
				_text = rest.reduce((accumulator, currentValue) => {
					return accumulator + '+' + currentValue;
				}, arg0);

				downloadUrl = `${downloadUrl}?text=${_text}`;
				break;
			case '011':
				if (colorRegx.test(arg0)) {
					rest = _otherArgs.slice(2);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg1);

					downloadUrl = `${downloadUrl}/${arg0}?text=${_text}`;
				} else {
					rest = _otherArgs.slice(1);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg0);

					downloadUrl = `${downloadUrl}?text=${_text}`;
				}

				break;
			case '101':
				if (colorRegx.test(arg0)) {
					rest = _otherArgs.slice(2);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg1);

					downloadUrl = `${downloadUrl}//${arg0}?text=${_text}`;
				} else {
					rest = _otherArgs.slice(1);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg0);

					downloadUrl = `${downloadUrl}?text=${_text}`;
				}
			case '111':
				if (colorRegx.test(arg0)) {
					if (colorRegx.test(arg1)) {
						rest = _otherArgs.slice(3);
						_text = rest.reduce((accumulator, currentValue) => {
							return accumulator + '+' + currentValue;
						}, arg2);

						downloadUrl = `${downloadUrl}/${arg0}/${arg1}?text=${_text}`;
					} else {
						rest = _otherArgs.slice(2);
						_text = rest.reduce((accumulator, currentValue) => {
							return accumulator + '+' + currentValue;
						}, arg1);

						downloadUrl = `${downloadUrl}/${arg0}?text=${_text}`;
					}
				} else {
					rest = _otherArgs.slice(1);
					_text = rest.reduce((accumulator, currentValue) => {
						return accumulator + '+' + currentValue;
					}, arg0);

					downloadUrl = `${downloadUrl}?text=${_text}`;
				}
				break;
		}
	}
};

switch (true) {
	case ['000', '100', '010'].includes(option):
		opt1Arg();
		break;
	case ['110'].includes(option):
		if (len === 1) {
			opt1Arg();
		} else {
			opt2Arg();
		}

		break;
	case ['001', '011', '101', '111'].includes(option) === option:
		if (len === 1) {
			opt1Arg();
		} else if (len === 2) {
			opt2Arg();
		} else {
			opt3Arg();
		}

		break;
}

downloadPic(downloadUrl, name, ext);
