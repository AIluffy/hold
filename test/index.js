import test from 'ava';
const exec = require('exec-sh').promise;
const os = require('os');

const downloadPath = os.platform() === 'win32' ? `${os.homedir()}\\Downloads\\` : `${os.homedir()}/Downloads/`;

test('hold', t => {
	return exec('hold', true).catch(err => {
		t.is(err.stdout, '**图片宽度未设置**\n');
	});
});

test('hold 0', t => {
	return exec('hold 0', true).catch(err => {
		t.is(err.stdout, '**请填写正确的图片宽度**\n');
	});
});

test('hold 100 0', t => {
	return exec('hold 100 0', true).catch(err => {
		t.is(err.stdout, '**请填写正确的图片高度**\n');
	});
});

test('hold 100', async t => {
	const out = await exec('hold 100', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100.jpg success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 300 200', async t => {
	const out = await exec('hold 300 200', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/300x200.jpg success downloaded, check path ${downloadPath}\n`
	);
});

test('hold -p 100', async t => {
	const out = await exec('hold -p 100', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100.png success downloaded, check path ${downloadPath}\n`
	);
});

test('hold -J 100', async t => {
	const out = await exec('hold -J 100', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100.jpeg success downloaded, check path ${downloadPath}\n`
	);
});

test('hold -j 100', async t => {
	const out = await exec('hold -j 100', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100.jpg success downloaded, check path ${downloadPath}\n`
	);
});

test('hold -g 100', async t => {
	const out = await exec('hold -g 100', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100.gif success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -c 110', async t => {
	const out = await exec('hold 100 200 -c 110', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg//110 success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -c ggg', async t => {
	const out = await exec('hold 100 200 -c ggg', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -b 110', async t => {
	const out = await exec('hold 100 200 -b 110', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg/110 success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -b ggg', async t => {
	const out = await exec('hold 100 200 -b ggg', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -t hello+world', async t => {
	const out = await exec('hold 100 200 -t hello+world', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg?text=hello+world success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -c 110 -t hello+world', async t => {
	const out = await exec('hold 100 200 -c 110 -t hello+world', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg//110?text=hello+world success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -b 999 -c 110', async t => {
	const out = await exec('hold 100 200 -b 999 -c 110', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg/999/110 success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -b 999 -t hello+world', async t => {
	const out = await exec('hold 100 200 -b 999 -t hello+world', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg/999?text=hello+world success downloaded, check path ${downloadPath}\n`
	);
});

test('hold 100 200 -b 999 -c 110 -t hello+world', async t => {
	const out = await exec('hold 100 200 -b 999 -c 110 -t hello+world', true);

	t.is(
		out.stderr,
		`- downloading placeholder pic...\n✔ placeholder pic https://via.placeholder.com/100x200.jpg/999/110?text=hello+world success downloaded, check path ${downloadPath}\n`
	);
});
