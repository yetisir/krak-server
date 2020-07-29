const vtkChainWebpack = require('vtk.js/Utilities/config/chainWebpack');
// const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  chainWebpack: (config) => {
    // Add project name as alias
    config.resolve.alias.set('@', [__dirname, 'src'].join('/'));
    // Add vtk.js rules
    vtkChainWebpack(config);
  },

  devServer: {
    disableHostCheck: true,
	  headers: {'Access-Control-Allow-Origin': '*'},
  },
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
  },

  // devServer: {
  //   disableHostCheck: true,
  // },
  // configureWebpack: {
  //   // resolve: {
  //   //   alias: {
  //   //     '@': [__dirname, 'src'].join('/'),
  //   //   },
  //   // },
  //   plugins: [
  //     new MonacoEditorPlugin({
  //       // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
  //       // Include a subset of languages support
  //       // Some language extensions like typescript are so huge that may impact build performance
  //       // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
  //       // Languages are loaded on demand at runtime
  //       languages: ['python'],
  //     }),
  //   ],
  // },
};
