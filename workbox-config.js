module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "*.{css,js,png,html}",
  ],
  "swDest": "public/sw.js",

  "globIgnores": ['screenshot2.png'],

  // Define runtime caching rules.
  runtimeCaching: [
  {
    urlPattern: /.*json$/,
    handler: 'NetworkFirst',
  },
  {
    urlPattern: /.*PogoAssets.*\.(?:png)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'pm-shiny-cache--cdn-image',
      expiration: {
        maxEntries: 1000,
      },
    },
  },
  ],
};
