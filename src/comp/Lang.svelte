<script>
	import { _, locale, locales } from 'svelte-i18n';
</script>

<label>
	🌐 {$_('lang')}
	<select bind:value={$locale}>
		{#each $locales as lang}
			<option value={lang} label={lang} />
		{/each}
	</select>
</label>