deploy: updateTime build build-sw
	npm run deploy

dev: copy-assets
	npm run dev;

build: copy-assets
	npm run build;

build-sw:
	echo 'yeah~';
# 	npm run build:sw

copy-assets:
	mkdir -p public; \
	cp -r ./assets/* ./public/; \
	node ./tasks/com-json.js;

updateTime:
	sed -i -r "s/[12][0-9]{3}-[01][0-9]-[0-3][0-9]/`date '+%F'`/g" './assets/index.html'; \
	git add './assets/index.html'; true; \
	git commit -m 'update time'; true; \

init: copy-assets
	npm install;
