<script>
	import { recorder, } from '@lib/recorder.svelte.js';
	import { status, name, } from '@/stores.js'
	import { get_time_string, } from '@lib/u.js';;

	// click to apply
	function click_record(index, data) {
		recorder.renew(index);
		recorder.save();
		status.set(data.status);
		name.set(data.name);
	}

	function add_record() {
		recorder.add({
			name: $name,
			status: $status,
		})
	}

</script>

<hr>

records:
<dl>
	{#each recorder.records as record, index}
		<dt>
			<button onclick={() => recorder.remove(index)}>x</button>
			<a href="###" onclick={() => click_record(index, record)}

				class="{record.name === $name && 'font:bolder'}"
			>
				{record.name}
			</a>
		</dt>

		<dd>
			<time datetime={new Date(record.time)}>
				{get_time_string(new Date(record.time))}
			</time>
			<br>
			{record.status}
		</dd>
	{/each}
</dl>

<hr>

<button onclick={() => add_record()}>Save now!</button>
