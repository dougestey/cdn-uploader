import test from 'ava';
import os from 'os';
import fs from 'fs';
import path from 'path';
import pify from 'pify';
import mkdirp from 'mkdirp';
import del from 'del';
import fileUtil from '../../lib/file-util.js';

const mkdirpP = pify(mkdirp);
const writeFile = pify(fs.writeFile);

const workPath = path.join(os.tmpdir(), 'cdn-test');
const file1 = path.join(workPath, 'test.txt');
const nested = path.join(workPath, 'nested');
const file2 = path.join(nested, 'test.txt');
const ignoredFile = path.join(workPath, '.ignore.txt');

test.before(() => mkdirpP(nested)
    .then(() => Promise.all([
        writeFile(file1, 'woop'),
        writeFile(file2, 'woop'),
        writeFile(ignoredFile, ''),
    ]))
);

test.after.always(() => del(workPath, { force: true }));

test('should include all actual files', async t => {
    const files = await fileUtil.getFilesToUpload(workPath);

    console.log(files)
    t.true(files.length === 2);
    t.true(files[0].name === 'test.txt');
    t.true(files[0].path === file2);
    t.true(files[1].name === 'test.txt');
    t.true(files[1].path === file1);
});

test('makeAbsolute', t => {
    const cwd = process.cwd();

    t.true(fileUtil.makeAbsolute() === cwd);
    t.true(fileUtil.makeAbsolute('./some-path') === `${cwd}/some-path`);
    t.true(fileUtil.makeAbsolute('/some-path') === '/some-path');
    t.true(fileUtil.makeAbsolute('some-path') === `${cwd}/some-path`);
});
