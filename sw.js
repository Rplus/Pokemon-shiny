var cacheName = 'shiny-list-v1.0';
var urlsToCache = [
	"./favicon.png",
	"./icon.jpg",
	"./index.html",
	"./l10n.js",
	"./pms.js",
	"./manifest.json",
	"./screenshot2.png",
	"./script.js",
	"./style.css",
	"./style.scss"
];

self.addEventListener('activate', function(event) {
  console.log('Finally active. Ready to start serving content!');  
});

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
 
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
  event.waitUntil(
    updateservicew(event.request)
	.then(refresh)
  );
});

function updateservicew(request) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
		var message = {
        type: 'refresh',
        url: response.url,
		eTag: response.headers.get('ETag')
      };
	  client.postMessage(JSON.stringify(message));
    });
  });
}
