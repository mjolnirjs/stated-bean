/* eslint-disable @typescript-eslint/no-var-requires */
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const RemoveStrictPlugin = require('remove-strict-webpack-plugin');
const path = require('path');

const projectName = 'stated-bean-example';

module.exports = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, './example/index.tsx'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  output: {
    filename: `${projectName}.js`,
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, '.'),
    port: 8081,
    https: true,
    historyApiFallback: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new RemoveStrictPlugin(),
  ],
};
