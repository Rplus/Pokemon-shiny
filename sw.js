importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

var nPrefix = (cache) => `pm-shiny-cache--${cache}`;

// html
workbox.routing.registerRoute(
  new RegExp('.*\.html$'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: nPrefix('html'),
  })
);

// vender assets
workbox.routing.registerRoute(
  // new RegExp('.\/html2canvas\/'),
  /.*\/(html2canvas.min.js|polyfill.min.js)$/,
  new workbox.strategies.CacheFirst({
    cacheName: nPrefix('vendor'),
  })
);

// js
workbox.routing.registerRoute(
  /.*\.js$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: nPrefix('js'),
  })
);

// css
workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: nPrefix('css'),
  })
);

// images
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // new RegExp('.\/assets\/regular\/.*\.(?:png|jpg|jpeg|svg|gif)'),
  new workbox.strategies.CacheFirst({
    cacheName: nPrefix('image'),
  })
);

// cdn images
workbox.routing.registerRoute(
  /.*weserv.*\.(?:png|jpg|jpeg|svg|gif)$/,
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

// precache放routing之後
workbox.precaching.precacheAndRoute([]);
