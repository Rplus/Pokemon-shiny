dev:
	pnpm run dev;

build:
	pnpm run build;

deploy: build
	pnpm run deploy;

fetch-names:
	node ./tasks/fetch-names.mjs;
