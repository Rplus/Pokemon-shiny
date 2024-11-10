<script>
	import Record from '@comp/Record.svelte';
	import Export from '@comp/Export.svelte';

	import { _, locale, locales } from 'svelte-i18n';

</script>


<details>
	<summary>ctrl</summary>

	<dl>
		<dt>history</dt>
		<dd>
			<Record />
		</dd>

		<dt>share</dt>
		<dd></dd>

		<dt>lang</dt>
		<dd>
			<div>
				<label>
					🌐 {$_('lang')}
					<select bind:value={$locale}>
						{#each $locales as lang}
							<option value={lang} label={lang} />
						{/each}
					</select>
				</label>
			</div>
		</dd>

		<dt>filter</dt>
		<dd>...</dd>

		<dt>ui</dt>
		<dd></dd>
	</dl>
</details>
