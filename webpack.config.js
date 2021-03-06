const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  mode: "development",
  entry: ["./public/assets/js/db.js", "./public/assets/js/index.js"],
  output: {
    path: __dirname + "/public/dist",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      name: 'On-the-Go-Budget app',
      short_name: 'Budget',
      description: 'An application that allows you to track your withdrawals and deposits with or without data/internet conection.',
      background_color: '#01579b',
      theme_color: '#ffffff',
      'theme-color': '#ffffff',
      start_url: '/',
      // icons: [
      //   {
      //     src: path.resolve('public/assets/icons/icon-192x192.png'),
      //     sizes: [96, 128, 192, 256, 384, 512],
      //     destination: path.join('assets', 'icons'),
      //   },
      // ],
    }),
  ],
};

module.exports = config;