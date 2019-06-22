deploy: addNewSW
	git push

sw:
	workbox injectManifest;

addNewSW: sw
	git add 'sw.js'; \
	git commit -m 'update sw.js'; \
