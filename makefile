deploy: build build-sw
	npm run deploy

build: copy-assets
	npm run build;

build-sw:
	workbox generateSW workbox-config.js;

copy-assets:
	cp -r ./assets/* ./public/
