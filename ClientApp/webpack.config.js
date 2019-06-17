const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = '../wwwroot/dist';
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

module.exports = (env) => {
    console.log('Production builder', env && env.production);
    const isDevBuild = !(env && env.production);
    return [{
        mode: !(env && env.prod) ? "development" : "production",
        entry: {
            'main': './App.tsx'
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            publicPath: 'dist/',
            filename: '[name].js'
        },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        devtool: !(env && env.production) ? "source-map" : undefined,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    loader: 'awesome-typescript-loader',
                    options: {
                        useCache: true,
                        isolatedModules: true
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: ExtractCssChunks.loader,
                            options: {
                                hot: true, // if you want HMR
                                reloadAll: true // when desperation kicks in - this is a brute force HMR flag
                            }
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            new ExtractCssChunks(
                {
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: "[name].css",
                    chunkFilename: "[id].css",
                    orderWarning: true // Disable to remove warnings about conflicting order between imports
                }
            )
        ]


    }];
};