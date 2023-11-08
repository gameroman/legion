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

    // Add a new rule for handling .js files with Babel
    config.module.rules.push({
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
        loader: 'babel-loader',
        options: {
            presets: [['@babel/preset-env', { modules: false }]],
            plugins: [
            ['@babel/plugin-transform-react-jsx', { pragma: 'h', pragmaFrag: 'Fragment' }],
            // Add other plugins if necessary
            ],
        },
        },
    });
  
    // If you already have a rule for fonts, you might need to adjust it:
    // Find the existing rule for fonts
    let rules = helpers.getLoadersByName(config, 'file-loader');
    let fontLoader = rules.find(r => r.rule.test.toString().includes('woff'));
    if (fontLoader) {
      fontLoader.rule.test = /\.(woff|woff2|eot|ttf|otf)$/;
    }

     // Add an alias for 'phaser' to point to the non-ESM build
    config.resolve.alias['phaser'] = path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js');


    // You may need to add or modify an existing rule for .ts or .tsx if using TypeScript
    const tsxRule = helpers.getLoadersByName(config, 'ts-loader')[0];
    if (tsxRule) {
        tsxRule.rule.options.transpileOnly = true; // Speed up compilation
        tsxRule.rule.options.compilerOptions = {
        ...tsxRule.rule.options.compilerOptions,
        module: 'esnext', // Use esnext modules to keep the ES module syntax
        };
    }

    // You might also want to exclude Phaser from certain processing rules
    const babelLoader = helpers.getLoadersByName(config, 'babel-loader')[0];
    if (babelLoader) {
        babelLoader.rule.exclude = [/node_modules[\\/]core-js/, /node_modules[\\/]webpack[\\/]buildin/, /node_modules[\\/]phaser/];
    }

    // Disable the SplitChunksPlugin
    // Disable react-hot-loader's filesystem polling
  config.watchOptions = {
        poll: false,
    };

  config.optimization.splitChunks = {
        cacheGroups: {
        default: false,
        },
    };

    // Disable separate runtime chunk for webpack's boilerplate
    config.optimization.runtimeChunk = false;
}
  