*Psst — looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

## Get started

Install the dependencies & copy assets to public folder...

```bash
make init;
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.


## Deploying to the web

```bash
make deploy
```

ps:  
`deploy` task will run 3 tasks:
* `updateTime`: update time string in page header
* `build`: build js
* `build-sw`: update service worker for PWA
