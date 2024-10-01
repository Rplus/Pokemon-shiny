dev:
	bun run dev;

build:
	bun run build;

deploy: build
	bun run deploy;


fetch: fetch-name fetch-pm
	echo 'hi';

fetch-pm:
	bun ./tasks/fetch-pm.js;

fetch-name:
	bun ./tasks/fetch-name.js;
