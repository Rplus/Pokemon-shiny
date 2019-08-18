<script>
import { onMount } from 'svelte';

let printTarget;
let exportWidthDefault;
let exportWidth;
const exportWidthMax = 3000;
const exportWidthMin = 200;
let exportImgSrc;
let printClass = 'print';

let downloadTitle;;

$: {
  downloadTitle = `${window.title && window.title.value || ''}-shiny-w${exportWidth}.jpg`;
}

onMount(() => {
  printTarget = document.querySelector('.pm-list');
  exportWidth = printTarget.clientWidth;
  exportWidthDefault = printTarget.clientWidth;
});

function generateImg(argument) {
  console.log('generateImg');
  document.body.classList.add(printClass);
  printTarget.scrollIntoView();

  html2canvas(
    printTarget, {
      width: exportWidth,
      // ignoreElements: null,
      // scale: 1,
      // useCORS: true,
    }
  )
  .then(canvas => {
    exportImgSrc = canvas.toDataURL('image/png');
    document.body.classList.remove(printClass);

    setTimeout(() => {
      document.querySelector('.export-img').scrollIntoView();
    }, 0);
  });
}

function setWidth() {
  printTarget.style.width = `${exportWidth}.px`;
}

function resetWidth() {
  exportWidth = exportWidthDefault;
}

$: {
  exportWidth = Math.min(
    exportWidthMax,
    Math.max(exportWidthMin, exportWidth)
  );
}


</script>

<fieldset>
  <legend data-l10n="export">Export</legend>

  Width:
  <label>
    <input type="number"
      id="output-width"
      min={ exportWidthMin }
      max={ exportWidthMax }
      pattern="[0-9]+"
      step="5"
      bind:value={ exportWidth }
    /> px
  </label>

  <button
    on:click|preventDefault={ setWidth }
    data-l10n="set-width"
  >
    Set
  </button>
  /
  <button
    type="reset"
    on:click|preventDefault={ resetWidth }
    data-l10n="reset-width"
  >
    Reset
  </button>

  <br>
  <br>


  <details open>
    <summary>
      <button
        on:click|preventDefault={ generateImg }
        data-l10n="generate-image"
      >
        generate image
      </button>
    </summary>

    <div class="export-img-placeholder">
      {#if exportImgSrc}
      <a download={ downloadTitle } href={ exportImgSrc }>
        <img class="export-img"
          src={ exportImgSrc }
          title={ downloadTitle }
          alt="export image"
        >
      </a>
      {/if}
    </div>
  </details>


</fieldset>
