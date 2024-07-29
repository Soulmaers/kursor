const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'production', // или 'production'
    entry: './public/js/main.js', // указываем путь к вашему entry point
    output: {
        path: path.resolve(__dirname, 'dist'), // указываем путь к папке, куда будут сохраняться бандлы
        filename: 'bundle.js', // имя бандла, который будет сгенерирован
    },
    module: {
        rules: [
            {
                test: /\.css$/, // обрабатываем CSS файлы
                use: ['style-loader', 'css-loader'], // загрузчики: сначала style-loader, потом css-loader
            },
            {
                test: /\.ejs$/, // обрабатываем EJS файлы
                use: ['ejs-webpack-loader'], // загрузчик EJS
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './views/in.ejs', // путь к вашему HTML шаблону
            filename: 'index.html', // имя сгенерированного HTML файла
            inject: 'body', // вставляем бандлы в конец body
        }),
    ],
};