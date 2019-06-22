deploy: updateTime updateSW
	git push

sw:
	workbox injectManifest;

updateSW: sw
	git add 'sw.js'; true; \
	git commit -m 'update sw.js'; true; \

updateTime:
	sed -i -r "s/[12][0-9]{3}-[01][0-9]-[0-3][0-9]/`date '+%F'`/g" 'manifest.json'; \
	git add 'manifest.json'; true; \
	git commit -m 'update time'; true; \

devCSS:
	sass --no-source-map --watch 'style.scss' 'style.css'
