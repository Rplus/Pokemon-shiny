<script>
import { lang, langs, tag, tags, search, searchStr } from '../stores.js';

let title = '';

function selectAll(argument) {
  console.log('#TODO selectAll');
}

$: {
  document.title = `✨ ${title} | Pokemon Shiny Checklist`;
}

</script>

  <label>
  nicename: <input type="text" name="title" id="title" bind:value={ title }>
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
  {#each tags as _tag}
  <label>
    <input type="radio" name="tags" bind:group={$tag} value={ _tag } />
    { _tag } /
  </label>
  {/each}

<br>

  <a href="###" on:click|preventDefault={ selectAll }>select all</a>
  <a href="./">reset</a>

<br>
=== { $searchStr } ===


<hr>
<hr>
<hr>
