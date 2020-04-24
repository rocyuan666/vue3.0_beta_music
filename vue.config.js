module.exports = {
  // 在vue-cli.3.3版本后  baseUrl被废除了，因此这边要写成 publicPath
  // baseUrl: './'     发布模式下 './'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  //路径别名
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'components': '@/components',
        'plugins': '@/plugins'
      }
    }
  }
}