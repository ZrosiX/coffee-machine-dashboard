const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ['cdn.discordapp.com', 'i.ytimg.com']
  },
  i18n
}
