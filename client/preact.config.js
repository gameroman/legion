/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

export default function (config, env, helpers) {
    // Add a new rule for .otf fonts
    config.module.rules.push({
      test: /\.otf$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/',
        publicPath: '/fonts/',
      },
    });

    // Add an alias for 'phaser' to point to the non-ESM build
    config.resolve.alias['phaser'] = path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js');
    config.resolve.alias['@legion/shared'] = path.resolve(__dirname, '../shared/');


    let babelLoader = helpers.getLoadersByName(config, 'babel-loader')[0].rule;
    babelLoader.exclude = /node_modules\/phaser/;
}
  