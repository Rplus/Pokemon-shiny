<script>
	import { _, locale } from 'svelte-i18n';

	import {
		default_nickname,
		nickname,
		pms_status,
		urls,
	} from '@/stores.js';

</script>


<div>
	<div class="text-right">
		<hr>
		<button>📥 {$_('export.as.csv')}</button>
	</div>
</div>
