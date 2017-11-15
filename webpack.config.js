const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { resolve } = require('path')

const isDevelop = process.env.NODE_ENV === 'dev'
const PORT = 3001
const BUILD_FOLDER = './dist/'


let entry = []
if (isDevelop) {
    entry = [
        'babel-polyfill',
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:${PORT}`,
        'webpack/hot/only-dev-server',
        './client',
    ]
} else {
    entry = [
        './client',
    ]
}

const NoEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin()
const NamedModulesPlugin = new webpack.NamedModulesPlugin()
const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    favicon: './favicon.ico',
    inject: 'body',
    hash: true,
})

const CommonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.bundle.js',
    minChunks: 2,
    allChunks: true,
})

const ExtractCss = new ExtractTextPlugin({
    filename: 'css/bundle.css',
    disable: isDevelop,
    allChunks: true,
})

const UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    minimize: true,
    sourceMap: false,
    output: {
        comments: false,
    },
})

const DefinePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
})

const plugins = [
    DefinePlugin,
    ExtractCss,
    HotModuleReplacementPlugin,
    CommonsChunkPlugin,
    NamedModulesPlugin,
    NoEmitOnErrorsPlugin,
    HtmlWebpackPluginConfig,
]

if (!isDevelop)
    plugins.push(UglifyJsPlugin)

module.exports = {
    entry,
    output: {
        filename: 'bundle.js',
        path: resolve(BUILD_FOLDER),
        publicPath: isDevelop ? '/' : './dist/',
        sourceMapFilename: '[name].js.map',
    },
    devtool: isDevelop ? 'inline-source-map' : false,
    resolve: {
        modules: [resolve(__dirname, './client'), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ExtractCss.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader'],
                }),
                exclude: /node_modules/,
            },
            {
                test: /\.scss|sass$/,
                use: ExtractCss.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader?sourceMap',
                    ],

                }),
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf)/i,
                exclude: /node_modules/,
                loader: 'url-loader',
                options: {
                    limit: 100000,
                },
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    limit: 100000,
                },
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: `${BUILD_FOLDER}[path][name].[ext]`,
                },
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
        ],
    },
    plugins,
    devServer: {
        open: true,
        port: PORT,
        publicPath: '/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        proxy: {
            '/api/': 'http://localhost:3000/',
            secure: false,
        },
        watchOptions: {
            ignored: '/node_modules/',
            poll: true,
        },
    },
};
