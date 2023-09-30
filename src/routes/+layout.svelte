<script>
	import './styles.css';
	import '../app.css';
	import Test from './test.svelte';
</script>

<div class="app">

	<main>
		<slot />
	</main>
	<Test />
	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>
