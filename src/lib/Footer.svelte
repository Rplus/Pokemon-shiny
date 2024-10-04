<script>
	function initFaceookLikeBtn() {
		// https://developers.facebook.com/docs/plugins/like-button
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'))
	}
</script>


<footer class="font-size:smaller flex flex-direction:row-reverse">
	<ul class="margin-bottom:.5em>li list-style:disc">
		<li>
			image from: <a href="https://github.com/ZeChrales/PogoAssets" target="_blank" rel="noopener">PogoAssets</a> repo.
		</li>
		<li>
			design style from: <a href="https://leekduck.com/shinylist/" target="_blank" rel="noopener">Leek Duck</a>
		</li>
		<li>
			report an issue in <a href="https://github.com/rplus/Pokemon-shiny/issues" target="_blank" rel="noopener">GitHub repo</a>
			<br>
			or add a new shiny one?
		</li>
		<li>
			<details class="fb-like-details">
				<summary on:click|once={ initFaceookLikeBtn }>
					Give a 👍️ with Facebook?
				</summary>
				<div class="fb-like"
					data-href="https://rplus.github.io/Pokemon-shiny/"
					data-layout="button_count"
					data-action="like"
					data-share="true">
				</div>
			</details>
		</li>
	</ul>
</footer>
