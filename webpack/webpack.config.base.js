const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports.config = (isProd) => {
    const result = {
        paths: {}
    };

    //#region paths
    result.paths.buildDir = path.resolve(__dirname, '../build');
    result.paths.publicDir = path.resolve(__dirname, '../public');
    result.paths.popupHtml = path.resolve(__dirname, '../public/extensionpopup.html');
    result.paths.optsHtml = path.resolve(__dirname, '../public/optionspage.html');

    fs.emptyDirSync(result.paths.buildDir);
    fs.copySync(result.paths.publicDir, result.paths.buildDir, {
        dereference: true,
        filter: file => file !== result.paths.popupHtml
    });
    //#endregion

    result.rules = {
        lint: {
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            loader: 'eslint-loader'
        },
        static: {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
            },
        },
        js: {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                babelrc: false,
                presets: ['env', 'flow', 'react'],
                plugins: [require('babel-plugin-transform-class-properties')],
                cacheDirectory: true,
                compact: !!isProd,
                cacheDirectory: !isProd
            }
        },
        css: {
            test: /\.(css|scss)$/,
            use: [{
                loader: "style-loader", // creates style nodes from JS strings
                options: {
                    hmr: !!isProd
                }
            }, {
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                    importLoaders: 1,
                    minimize: !!isProd,
                    sourceMap: !isProd
                }
            }, {
                loader: "sass-loader", // compiles Sass to CSS
                options: {
                    sourceMap: !isProd
                }
            }]
        },
        file: {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: 'file-loader',
            options: {
                name: 'static/media/[name].[hash:8].[ext]',
            }
        }
    };

    result.plugins = {
        popupHtml: new HtmlWebpackPlugin({
            inject: true,
            template: result.paths.popupHtml,
            filename: "extensionpopup.html"
        }),
        optsHtml: new HtmlWebpackPlugin({
            inject: true,
            template: result.paths.optsHtml,
            filename: "optionspage.html"
        }),
        provideJquery: new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        react: new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        uglify: new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                comparisons: false
            },
            output: {
                comments: false,
                ascii_only: true
            }
        }), //minify everything
        merge: new webpack.optimize.AggressiveMergingPlugin() //Merge chunks
    };

    if (isProd) {
        result.plugins.html.minify = {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }
    }

    return result;
}