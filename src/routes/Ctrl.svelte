<script>
import {
  lang, langs,
  show, shows,
  // tag, tags,
  // dex,
  searchStr,
  nickname,
} from '../stores.js';

function selectAll(argument) {
  console.log('#TODO selectAll');
}

$: {
  document.title = `✨ ${$nickname} | Pokemon Shiny Checklist`;
}

</script>

  <label>
  nicename: <input type="text" name="title" id="title" bind:value={ $nickname }>
  </label>

<br>

  <label>
  lang:
  <select bind:value={ $lang }>
    {#each langs as lang}
    <option value="{ lang }">{ lang }</option>
    {/each}
  </select>
  </label>

<br>

  show:
  {#each shows as _show}
  <label>
    <input type="radio" name="shows" bind:group={$show} value={ _show } />
    { _show } /
  </label>
  {/each}

<br>

  <a href="###" on:click|preventDefault={ selectAll }>select all</a>
  <a href="./">reset</a>

<br>
【{ $searchStr }】

<hr>
<hr>
<hr>
