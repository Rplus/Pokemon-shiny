importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.setConfig({ debug: location.hostname === 'localhost' });

// html
workbox.routing.registerRoute(
  new RegExp('.*\.html$'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'pm-shiny-cache--html'
  })
);

// vender assets
workbox.routing.registerRoute(
  // new RegExp('.\/html2canvas\/'),
  /.*\/(html2canvas.min.js|polyfill.min.js)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'pm-shiny-cache--vendor'
  })
);

// js
workbox.routing.registerRoute(
  /.*\.js$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pm-shiny-cache--js'
  })
);

// css
workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pm-shiny-cache--css'
  })
);

// images
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // new RegExp('.\/assets\/regular\/.*\.(?:png|jpg|jpeg|svg|gif)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'pm-shiny-cache--image',
  })
);

// cdn images
workbox.routing.registerRoute(
  /.*weserv.*\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'pm-shiny-cache--cdn-image',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        // Cache only 20 images.
        maxEntries: 1000,
        // Cache for a maximum of a month.
        maxAgeSeconds: 7 * 24 * 60 * 60 * 30,
      })
    ],
  })
);

// precache放routing之後
workbox.precaching.precacheAndRoute([]);
