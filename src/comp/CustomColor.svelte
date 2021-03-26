<script>
  import { _ } from 'svelte-i18n';
  import { colors, defaultColors } from '../stores.js';

  const reset = (e) => {
    colors.set(defaultColors);
  };
</script>



<form class="mb-1">
  { $_('custom.color') }:
  <br>

  {#each $colors as _color, index }
    <label class="clickable-label">
      <input type="color" name="custom-color" defaultvalue="#ff0000" bind:value={ _color } />
    </label>
  {/each}

  <input type="reset" on:click|preventDefault={ reset } />

</form>
