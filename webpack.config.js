const path = require('path');

module.exports = {
    entry: './src/extensioncontentscript.js',
    output: {
        filename: 'extensioncontentscript.js',
        path: path.resolve(__dirname, 'build')
    }
};