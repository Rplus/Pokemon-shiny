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
    "revision": "9f57f57621f529c999dc30ec5a52789b"
  },
  {
    "url": "bundle.js",
    "revision": "3820c4a452ae32404628b091ccc3d04b"
  },
  {
    "url": "favicon.png",
    "revision": "c8f26ae99b1a32a101924c83781a87a9"
  },
  {
    "url": "icon.png",
    "revision": "c0e7522596d105b700d1d6d0cbbcd47c"
  },
  {
    "url": "index.html",
    "revision": "41301fc1e1a31ad1e6383c2355f658f0"
  },
  {
    "url": "manifest.json",
    "revision": "d93f011a51b504ce5b8e7aec57638900"
  },
  {
    "url": "pms.json",
    "revision": "248289634ab5cac5ead7642c28362cba"
  },
  {
    "url": "screenshot2.png",
    "revision": "48818a4fa95ad571f1a7b4603473eb14"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
