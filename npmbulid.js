module.exports = {
  publicPath: './',
  css: {
    requireModuleExtension: false,
    extract: false,
    sourceMap: false,
  },
  productionSourceMap: false,
  chainWebpack: con => {
    // js打包输出配置
    con.target('web'); // 默认为web
    // con.output.libraryExport('default'); // 对外暴露default属性，就可以直接调用default里的属性
    con.entryPoints.delete('app');
    con.entry('Calendar').add('./src/index.js');
    con.output.chunkFilename('[name].js');
    con.output.library('Calendar');
    con.output.libraryTarget('umd');
    con.output.filename('[name].js');
    con.optimization.splitChunks({ // 不拆分包
      cacheGroups: {},
    });
    // 禁用插件
    con.plugins
      .delete('workbox')
      .delete('copy')
      .delete('prefetch')
      .delete('preload')
      .delete('pwa')
      .delete('html');
  },
}