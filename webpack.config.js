const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './public',
    },
    plugins: [
        new webpack.ProvidePlugin({
            p5: 'p5',
            io: ['socket.io-client', 'io'],
        }),
        new HtmlWebpackPlugin({
            title: 'Development',
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
        clean: true,
        publicPath: '/',
    },
};
