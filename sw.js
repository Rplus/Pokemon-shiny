if(!self.define){let e,n={};const i=(i,s)=>(i=new URL(i+".js",s).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,c)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let r={};const d=e=>i(e,o),t={module:{uri:o},exports:r,require:d};n[o]=Promise.all(s.map((e=>t[e]||d(e)))).then((e=>(c(...e),r)))}}define(["./workbox-31b6daed"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"bundle.css",revision:"27a4542ee3cda4830213c8ed46036b7e"},{url:"bundle.js",revision:"e3bfb81014a705fa1e7f35419388f4c1"},{url:"favicon.png",revision:"c8f26ae99b1a32a101924c83781a87a9"},{url:"html2canvas.min.js",revision:"07dfafa027eb2f5e81f234eeaa30ec16"},{url:"icon.png",revision:"c0e7522596d105b700d1d6d0cbbcd47c"},{url:"index.html",revision:"497dff4d406d542c92f710ec24a1ccee"},{url:"pokemon_icon_000.png",revision:"b8fd366bba04e4f3157a3f1c5d579bc2"}],{}),e.registerRoute(/.*json$/,new e.NetworkFirst,"GET"),e.registerRoute(/.*PogoAssets.*\.(?:png)$/,new e.CacheFirst({cacheName:"pm-shiny-cache--cdn-image",plugins:[new e.ExpirationPlugin({maxEntries:1e3})]}),"GET")}));
//# sourceMappingURL=sw.js.map
