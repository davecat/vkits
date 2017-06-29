var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: 'dist/',
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        proxy: {
            '/api/v1/*': {
                target: 'http://localhost:5001',
                secure: false
            },
            '/riskcontrol/*': {
                target: 'http://localhost:5001',
                secure: false
            },
            '/postlending/*': {
                target: 'http://localhost:5001',
                secure: false
            },
            '/counter/*': {
                target: 'http://localhost:5001',
                secure: false
            },
            '/anon/*': {
                target: 'http://localhost:5001',
                secure: false
            },
            '/admin/api/branch/*': {
                target: 'http://192.168.0.107:8001',
                secure: false
            },
            '/api/upload/*': {
                target: 'http://192.168.0.107:8001',
                secure: false
            }
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                QINIU: 'https://libfile1.wezebra.com/',
                UPLOAD: 'https://upload-z2.qbox.me'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}

if(process.env.NODE_ENV === 'development') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('"development"'),
                QINIU: JSON.stringify('http://7xt1kq.com1.z0.glb.clouddn.com/'),
                UPLOAD: JSON.stringify('http://upload.qiniu.com')
            }
        }),
    ])
}
