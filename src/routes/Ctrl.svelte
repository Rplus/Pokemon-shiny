<script>
import { _ } from 'svelte-i18n';
import Urls from './Urls.svelte';
import {
  lang, langs,
  show, shows, showUnregistered,
  dex,
  searchStr,
  nickname,
  pmTotalStatus,
  compareImg, saveConfigForCompareImg,
} from '../stores.js';
import GitHubCorner from './Github-icon.html';
import Share from './Share.html';

function selectAll() {
  if (!$pmTotalStatus[0]) {
    return;
  }

  $dex = {
    ...$dex,
    ...{
      dex: `${$dex.dex}-${$pmTotalStatus[0].join('-')}`,
    },
  };
}

$: {
  document.title = `✨ ${$nickname} | Pokemon Shiny Checklist`;
}

$: {
  saveConfigForCompareImg($compareImg);
}

$: updateTime = document.querySelector('meta[name="update-time"]').content;

let lockPmList = false;

let counterLabel = [
  'released',
  'registered',
  'owns',
];

let counter = {
  released: 0,
  registered: 0,
  owns: 0,
  rate: {
    owns: 0,
    registered: 0,
  },
};

window.counter=  counter;

let shadowNickname;
let nicknameWidth;
let defaultStatus = {
  0: [],
  1: [],
  2: [],
  3: [],
};

$: {
  let _status = { ...defaultStatus, ...$pmTotalStatus }
  let allCount = Object.values(_status).map(i => i.length);
  counterLabel.forEach((i, idx) => {
    counter[i] = allCount.slice(idx).reduce((all, i) => all + i, 0);
  });

  counter.rate.owns = (counter.owns / counter.released).toFixed(5);
  counter.rate.registered = (counter.registered / counter.released).toFixed(5);
}

let switcher = {
  ctrl: false,
};

</script>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<header
  class="header"
  style={ `--rate-owns: ${counter.rate.owns}; --rate-registered: ${counter.rate.registered};` }
>

  <h1>
    <img src="./favicon.png" width="36" height="36" alt="">
    Shiny Checklist
  </h1>

  <label class="db">
    { $_('nickname') }:
    <input class="nickname" type="text"
      id="title"
      style={ `min-width: ${ nicknameWidth }px` } 
      size={ $nickname.length || 8 }
      placeholder="Enter your ID"
      bind:value={ $nickname }
    >
    <span class="nickname nickname-shadow"
      bind:this={ shadowNickname }
      bind:offsetWidth={ nicknameWidth }
    >
      { $nickname }
    </span>
  </label>

  <div class="counter">
    <span class="counter-item">
      { $_('owns') }
      <span class="counter-number">
        { counter.owns }
      </span>
    </span>

    <span class="counter-item">
      { $_('registered') }
      <span class="counter-number">
        { counter.registered }
      </span>
    </span>

    <span class="counter-item">
      { $_('released') }
      <span class="counter-number">
        { counter.released }
      </span>
    </span>

  </div>

  <GitHubCorner />
  <time class="update-time">{ updateTime }</time>
</header>



<section class="ctrlor hide-for-print">

  <input type="checkbox" id="switcher--ctrl" bind:checked={ switcher.ctrl } class="sr-only" />

  <label
    for="switcher--ctrl"
    class="button footer-button switcher switcher--ctrl"
    title={ $_('ctrl.switcher') }
  >
    ⚙️
  </label>

  <div class="ctrl-content" class:active={ switcher.ctrl }>

    <div>
      <div class="mb-1 df ai-c">
        <div>
        <a class="clickable" href="###" on:click|preventDefault={ selectAll }>{ $_('select.all') }</a>
        /
        <a class="clickable" href={ `./?1&lang=${$lang}` }>{ $_('reset') }</a>
        </div>

        <label class="ml-a clickable">
          <input type="checkbox" bind:checked={ $compareImg }>
          { $_('compare.image') }
        </label>
      </div>

      <hr>

      <div class="mb-1">
        <label>
          { $_('lang') }:
          <br>
          <select class="lang-ctrl" bind:value={ $lang }>
            {#each langs as lang}
            <option value="{ lang }">{ lang }</option>
            {/each}
          </select>
        </label>
      </div>

      <div class="ctrl-show mb-1">
        { $_('show') }:
        <br>
        {#each shows as _show, index }
          <label class="clickable-label">
            <input class="sr-only" type="radio" name="shows" bind:group={$show} value={ _show } disabled={ $showUnregistered } />
            <div class="show-types clickable">
              { $_(`show.${_show}`) }
            </div>
              <div class="pm pm--demo" data-status={index}>
                <div class="pm-img-box">
                  <img src="./pokemon_icon_000.png" alt="sample" class="pm-img" />
                </div>
              </div>
          </label>
        {/each}

        <label class="clickable-label db">
          <span class="clickable">
            <input class="m-0" type="checkbox" bind:checked={ $showUnregistered } />
            { $_('show.unregistered') }
          </span>
        </label>
      </div>

    </div>

    <hr>
    <Share searchStr={ searchStr } />
    <hr>

    <Urls/>
  </div>

  <label class="ctrl-content-overlay" for="switcher--ctrl"></label>
</section>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<style global>
  .header {
    position: relative;
    margin-bottom: 3rem;
    padding-top: 2rem;
    padding-bottom: 1rem;
    background-image: linear-gradient(-230deg, #9e9e9e, #ff5722);
    background-color: #d35fa0;
    color: #fff;
    font-family: sans-serif;

    h1 {
      margin-bottom: 1rem;
      font-size: 2.5rem;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: .5em;
      width: calc(100% * var(--r));
      background-color: rgba(255, 255, 255, .2);
    }

    &::before { --r: var(--rate-owns, 0); }
    &::after { --r: var(--rate-registered, 0); }

    > * {
      margin-bottom: 1rem;
    }
  }

  .nickname {
    display: inline-block;
    min-width: 3em;
    max-width: 15em;
    padding: 3px 1em;
    vertical-align: middle;
    border: unset;
    color: #fff;
    text-align: center;
    font-size: larger;
    font-weight: 900;
    background: none;
    background-color: rgba(255, 255, 255, .1);
    box-shadow: inset 0 -.2em rgba(255, 255, 255, .5);
    border-radius: 0;

    &::placeholder {
      color: inherit;
      font-weight: normal;
      font-size: smaller;
    }

    &.nickname-shadow {
      position: absolute;
      top: 0;
      left: 0;
      white-space: nowrap;
      overflow: hidden;
      pointer-events: none;
      visibility: hidden;
    }
  }

  .counter-item {
    position: relative;
    display: inline-flex;
    flex-direction: column-reverse;
    justify-content: center;
    margin-left: .7em;
    margin-right: .7em;
    vertical-align: middle;
    color: rgba(255, 255, 255, .6);

    .counter-number {
      display: block;
      font-size: 1.3em;
      font-weight: bolder;
      color: #fff;
    }

    + .counter-item {
      &::before {
        content: '/';
        position: absolute;
        left: -1em;
      }
    }
  }

  .lang-ctrl {
    padding: 3px 10px;
    text-transform: uppercase;
    font-family: monospace;
    text-align: center;
    font-size: 1.2em;
  }

  .ctrl-content {
    position: fixed;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    z-index: 11;
    max-width: calc(100% - 2rem);
    visibility: hidden;
    padding: 2em 5vmin 5em 5vmin;
    text-align: left;
    box-shadow: 0 0 1em rgba(0, 0, 0, .5);
    background-color: #fff;
    /* overflow-y: scroll; */
    /* opacity: 0; */

    &.active {
      /* display: block; */
      visibility: visible;
      overflow: auto;
      /* opacity: 1; */
    }
  }

  .ctrl-content-overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 1rem;
    background-color: rgba(0, 0, 0, .4);
    opacity: .2;

    .ctrl-content.active + & {
      width: 100%;
      opacity: 1;
      backdrop-filter: blur(3px);
    }
  }

  input[name="shows"][disabled] + .clickable {
    text-decoration: line-through;
    filter: blur(1px) opacity(.75);
    pointer-events: none;
  }

  .update-time {
    position: absolute;
    top: 100%;
    right: 0;
    color: rgba(0, 0, 0, .3);
    font-family: monospace;

    &:not(:empty)::before {
      content: 'update: ';
    }
  }

  .clickable-label {
    display: inline-block;
    min-width: 70px;
    margin-bottom: .5rem;
    padding-left: .2rem;
    padding-right: .2rem;
    text-align: center;
    font-size: small;

    &.db {
      display: block;
      width: fit-content;
    }
  }

  .pm.pm--demo {
    margin: .3rem auto 0;
    font-size: calc(3rem + 3vmin);

    &::before {
      border-width: 2px;
    }
  }

</style>
