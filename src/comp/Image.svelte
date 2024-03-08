<script>
	export let fn;
	export let ext;
	export let shiny = undefined;

	let imgRef;
	let src = null;
	src = ext || get_pm_img_src(fn);

	function get_pm_img_src(fn = '', shiny = true) {
		return `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets/Images/Pokemon%20-%20256x256/Addressable%20Assets/${fn}.${shiny ? 's.' : ''}icon.png`;
	}

</script>


<img
	bind:this={imgRef}
	src={src}
	class="pm-img"
	loading="lazy"
	width="128"
	height="128"
	decoding="async"
	alt=""
	{...$$restProps}
/>
