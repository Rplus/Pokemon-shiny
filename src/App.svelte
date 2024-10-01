<script>
	import pm from '@data/pm.csv';
	import name from '@data/name.csv';
	import { _, } from 'svelte-i18n';

	console.log({pm, name});
</script>

<h1 class="font:40 font:red font:heavy m:50 text:center">
	{$_('order')}
</h1>

<hr class="border-color:red">
<hr class="border-color:red">
<hr class="border-color:red">
