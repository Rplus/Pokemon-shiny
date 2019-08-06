<script>
  export let params = {}
</script>


<h2 class="routetitle">Hi there!</h2>
<p id="nameparams">
  Your name is: <b>{params.first}</b>
  {#if params.last }
  , <b>{params.last}</b>
  {/if}
</p>

<p>
  <em>Hint:</em>
  Try changing the URL and add your name, e.g.
  <code>/hello/jane/doe</code>
</p>
