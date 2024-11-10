<script>
	import { get_pm_img_src, get_name, } from '@lib/u.js';

	let { pm, status, handle_click_pm, } = $props();

	let name = get_name(pm.name, 'zh');
	let src = `/img/${pm.pid}.s.icon.png`
	// let src = get_pm_img_src(pm.pid, true);
</script>

<div class="pm status-{status} text-align:center position:relative width:96 height:96"
	onclick={() => handle_click_pm(pm.index)}
>
	<!--
	<img
		class="display:block"
		width="96"
		height="96"
		src={src}
		alt={pm.pid}
		loading="lazy"
	/>
	-->

	<div class="position:absolute bottom:0 left:0 right:0">
		index:{pm.index}
		<br>
		status: {status}
		<br>
		{get_name(pm.name, 'zh')}
	</div>
</div>

<style>
	img {
		font-family: inherit;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			background-color: #ccc;
			inset: 0;
			box-shadow: inset 0 0 2px;
		}

		&::after {
			content: '\2639' '\A' attr(alt);
			position: absolute;
			inset: 0;
			z-index: 2;
			white-space: pre-wrap;
			place-content: center;
			text-align: center;
		}
	}

	.pm {
		box-shadow: inset 0 0 0 1px;
	}
	.pm.status-0 {

	}
	.pm.status-1 {
	}
	.pm.status-2 {

	}
	.pm.status-3 {

	}
</style>