<script>
import { onMount } from 'svelte';
import { _ } from 'svelte-i18n';
import { nickname } from '../stores.js';

let printTarget;
let exportWidthDefault;
let exportWidth;
let exportScale = 1;
const exportWidthMax = 3000;
const exportWidthMin = 200;
let defaultImgSrc = './favicon.png';
let exportImgSrc = defaultImgSrc;
let printClass = 'print';

let downloadTitle;;

$: {
  downloadTitle = `${ $nickname }-shiny-w${exportWidth}.jpg`;
}

onMount(() => {
  printTarget = document.querySelector('.workspace');
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
      scale: exportScale,
      useCORS: true,
    }
  )
  .then(canvas => {
    document.body.classList.remove(printClass);

    canvas.toBlob((blob) => {
      exportImgSrc = URL.createObjectURL(blob);
    });

    setTimeout(() => {
      document.querySelector('.export-img').scrollIntoView();
    }, 0);
  });
}

function setWidth() {
  printTarget.classList.add('overwrite-width');
  printTarget.style.width = `${exportWidth}.px`;
}

function resetWidth() {
  printTarget.classList.remove('overwrite-width');
  printTarget.style.width = 'unset';
  exportWidthDefault = printTarget.clientWidth;
  exportImgSrc = defaultImgSrc;
  exportWidth = exportWidthDefault;
}

$: {
  exportWidth = Math.min(
    exportWidthMax,
    Math.max(exportWidthMin, exportWidth)
  );
}

</script>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<fieldset class="output-wrap hide-for-print">
  <legend>{ $_('export') }</legend>

  <label class="output-width">
    { $_('width') }:
    <input type="number"
      min={ exportWidthMin }
      max={ exportWidthMax }
      pattern="[0-9]+"
      step="5"
      bind:value={ exportWidth }
    /> px
  </label>
  <br>

  <label class="output-width">
    { $_('scale') }:
    x
    <input type="number"
      min=".5"
      max="3"
      pattern="[0-9]+"
      step=".1"
      bind:value={ exportScale }
    />
  </label>

  <details class="output-details" open>
    <summary>

      <button on:click|preventDefault={ setWidth }>
        { $_('set.width') }
      </button>
      /
      <button type="reset" on:click|preventDefault={ resetWidth }>
        { $_('reset.width') }
      </button>
      /
      <button on:click|preventDefault={ generateImg }>
        { $_('generate.image') }
      </button>

    </summary>

    <hr>

    <div class="export-img-placeholder">
      {#if exportImgSrc }
        <a
          download={ downloadTitle }
          href={ exportImgSrc !== defaultImgSrc ? exportImgSrc : null }
        >
          <img
            class="export-img"
            src={ exportImgSrc }
            title={ downloadTitle }
            alt="export image"
          >
        </a>
      {/if}
    </div>

  </details>

</fieldset>



<!-- =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  =====  ===== -->



<style global>
.output-wrap {
  width: 90%;
  max-width: 600px;
  margin: 1em auto 0;
  padding: 10px 3%;
  border: 2px dotted #ccc;

  hr {
    margin-top: 1em;
    margin-bottom: 1em;
  }
}

.output-width {
  display: inline-block;
}

.output-details {
  margin-top: .5rem;
}

.export-img {
  max-width: 70%;
  border: .25em dashed #ccc;
}

legend {
  border: 1px dotted #000;
  padding: .35em 1em;
}

.overwrite-width .pm-list {
  max-width: unset;
}
</style>
