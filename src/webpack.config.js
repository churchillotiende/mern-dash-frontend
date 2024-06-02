const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        alias: {
            '@syncfusion': path.resolve(__dirname, 'node_modules/@syncfusion'),
        },
    },
};
