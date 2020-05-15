const vtkChainWebpack = require('vtk.js/Utilities/config/chainWebpack');

module.exports = {
  chainWebpack: (config) => {
    // Add project name as alias
    //config.resolve.alias.set('vue-vtkjs-pvw-template', __dirname);

    config.resolve.alias.set('@', [__dirname, 'src'].join('/'));
    // Add vtk.js rules
    vtkChainWebpack(config);
  },
};
