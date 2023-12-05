<script>
	export let title = '';
	export let checked = false;
	export let op1 = 'op1';
	export let op2 = 'op2';

</script>


<label>
	{title}
	<div class="box">
		<input type="checkbox" bind:checked={checked} class="visually-hidden">
		<span class="op op1">{op1}</span>
		<span class="op op2">{op2}</span>
	</div>
</label>


<style>
	label {
		display: block;
		width: fit-content;
		cursor: pointer;
		text-align: center;
	}

	.op {
		padding: 0.1em 0.5em;
		border-radius: 0.2em;
	}

	input:checked ~ .op1,
	input:not(:checked) ~ .op2 {
		background-color: #0002;
	}
</style>
