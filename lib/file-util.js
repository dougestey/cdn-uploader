'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('globby');

function makeAbsolute (filePath = '') {
    return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

function isDirectory (dir) {
    try {
        return fs.lstatSync(dir).isDirectory();
    } catch (err) {
        return false;
    }
}

function getFilesToUpload (...globs) {
    const newGlobs = globs.map(glob => isDirectory(glob) ? `${glob}/**/*` : glob);

    console.log(newGlobs)

    return globby(newGlobs)
        .then(files => {
            return files.map(file => ({
                name: path.basename(file),
                path: file,
            }));
        })
        .catch(e => {
            console.log(e);
        });
}

module.exports = { makeAbsolute, isDirectory, getFilesToUpload };
