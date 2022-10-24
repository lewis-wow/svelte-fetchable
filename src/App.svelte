<script>
	import { loadable } from './lib/store'

	const [result, loading] = loadable('https://jsonplaceholder.typicode.com/posts')
</script>

<main>
	<div>
		{#if $loading}
			<span>loading...</span>
		{:else}
			<span>result: {JSON.stringify($result)}</span>
		{/if}
	</div>

	<button on:click={() => result.fetch()}>Fetch</button>
</main>
