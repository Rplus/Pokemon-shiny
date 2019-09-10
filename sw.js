/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "bundle.css",
    "revision": "382df2d25daef70ed847ce277706d738"
  },
  {
    "url": "bundle.js",
    "revision": "22c4067241a3bb8fad0554616df49fee"
  },
  {
    "url": "favicon.png",
    "revision": "c8f26ae99b1a32a101924c83781a87a9"
  },
  {
    "url": "html2canvas.1.0.0-rc.min.js",
    "revision": "07dfafa027eb2f5e81f234eeaa30ec16"
  },
  {
    "url": "html2canvas.min.js",
    "revision": "07dfafa027eb2f5e81f234eeaa30ec16"
  },
  {
    "url": "html2canvas.svg.min.js",
    "revision": "64ce3c5e207d482033d28f130563b12e"
  },
  {
    "url": "icon.png",
    "revision": "c0e7522596d105b700d1d6d0cbbcd47c"
  },
  {
    "url": "index.html",
    "revision": "f5df8820bcf06620ad5d5edb519947d8"
  },
  {
    "url": "manifest.json",
    "revision": "d93f011a51b504ce5b8e7aec57638900"
  },
  {
    "url": "pms.json",
    "revision": "e11810231a829a3e1585ab73fc311a99"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*PogoAssets.*\.(?:png)$/, new workbox.strategies.CacheFirst({ "cacheName":"pm-shiny-cache--cdn-image", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, purgeOnQuotaError: false })] }), 'GET');
