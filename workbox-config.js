module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "*.{css,js,png,html,json}",
  ],
  "swDest": "public/sw.js",

  "globIgnores": ['screenshot2.png'],

  // Define runtime caching rules.
  runtimeCaching: [
  {
    urlPattern: /.*PogoAssets.*\.(?:png)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'pm-shiny-cdn-image',
      expiration: {
        maxEntries: 1000,
      },
    },
  },
  ],
};
