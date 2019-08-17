importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

var nPrefix = (cache) => `pm-shiny-cache--${cache}`;

workbox.setConfig({
  debug: false
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.core.setCacheNameDetails({
  prefix: 'pm-shiny',
  suffix: 'v1',
});

// html
workbox.routing.registerRoute(
  /index\.html/,
  // new RegExp('.*\.html$'),
  new workbox.strategies.StaleWhileRevalidate()
);

// vender assets
workbox.routing.registerRoute(
  // new RegExp('.\/html2canvas\/'),
  /.*\/(html2canvas.min.js|polyfill.min.js)$/,
  new workbox.strategies.CacheFirst()
);

// js
workbox.routing.registerRoute(
  /.*\.js$/,
  new workbox.strategies.StaleWhileRevalidate()
);

// css
workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.StaleWhileRevalidate()
);

// images
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst()
);

// manifest
workbox.routing.registerRoute(
  '/manifest.json',
  new workbox.strategies.NetworkFirst()
);

// cdn images
workbox.routing.registerRoute(
  /.*PogoAssets.*\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: nPrefix('cdn-image'),
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        // Cache only 1000 images.
        maxEntries: 1000,
        // Cache for a maximum of a month.
        maxAgeSeconds: 7 * 24 * 60 * 60 * 30,
      })
    ],
  })
);
// precache
workbox.precaching.precacheAndRoute([], {
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/]
});
