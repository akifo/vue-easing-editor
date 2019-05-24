module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? '/vue-easing-editor/' : '/',
  chainWebpack: config => {
    config.resolve.extensions.prepend('.ts')
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .tap(() => {
        return { appendTsSuffixTo: [/\.vue$/] }
      })
      .end()
  }
}
