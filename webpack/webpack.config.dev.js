const baseConfig = require("./webpack.config.base");
const { paths, rules, plugins } = baseConfig.config();

module.exports = [{
    entry: './src/background/extensionbackground.js',
    output: {
        filename: 'extensionbackground.js',
        path: paths.buildDir
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [rules.lint, rules.js]
    }
}, {
    entry: './src/contentscript/extensioncontentscript.js',
    output: {
        filename: 'extensioncontentscript.js',
        path: paths.buildDir
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [rules.lint, rules.js, rules.css]
    }
}, {
    entry: './src/extensionpopup.js',
    output: {
        filename: 'extensionpopup.js',
        path: paths.buildDir
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [rules.lint, {
            oneOf: [rules.static, rules.js, rules.css, rules.file]
        }]
    },
    plugins: [plugins.html, plugins.provideJquery]
}];