// const path = require('path')
// const webpack = require('webpack')
const fs = require('fs');
// module.exports = {
//   configureWebpack: {
//     resolve: {
//       extensions: ['.js'],
//       alias: {
//         'jquery': 'jquery/dist/jquery.slim.js',
//       }
//     },
//     plugins: [
//       new webpack.ProvidePlugin({
//         '$': 'jquery',
//         jQuery: 'jquery',
//         // Popper: ['popper.js', 'default'],
//         'Util': "exports-loader?Util!bootstrap/js/dist/util"
//       }),
//       // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
//     ]
//   }
// }
module: {
    rules: [
        {
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                hotReload: false // disables Hot Reload
            }
        }
    ];
}

// const folder = "C:/Users/Rushidi/Desktop/Kalsym/pool-billing-frontend/dist";
// const path = require("path");
module.exports = {

    // devServer: {
    //     https: {
    //         key: fs.readFileSync('./certs/example.com+5-key.pm'),
    //         cert: fs.readFileSync('./certs/example.com+5.pm')
    //     },
    //     public: 'https://localhost:8080'
    // },
    
    // outputDir: path.resolve(__dirname, folder),
    productionSourceMap: false,
    // publicPath: process.env.NODE_ENV === 'production'
    // ? '/dist/'
    // : '/',
    // baseUrl: "/static/",
    chainWebpack: config => {
        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap(options => {
                options.compilerOptions = { whitespace: "condense" };
                return options;
            });
    },
    configureWebpack: {
        optimization: {
            splitChunks: {
                minSize: 10000,
                maxSize: 200000
            }
        }
    }
};
