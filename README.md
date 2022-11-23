# Cofein (svelte fetchable)

```bash
npm i svelte-fetchable
```

```svelte
<script>
	import { fetchable } from 'svelte-fetchable'

	const [resultFetch, loadingFetch] = fetchable('https://jsonplaceholder.typicode.com/posts', { method: 'post' })
</script>

<main>
	<div>
		<h1>Axios</h1>
		{#if $loadingFetch}
			<span>loading...</span>
		{:else}
			<span>result: {JSON.stringify($resultFetch)}</span>
		{/if}

		<br />
		<button on:click={() => resultFetch.fetch({ username: 'John Doe' })}>Fetch</button>
		<br />
		<button on:click={resultFetch.abort}>Abort</button>
	</div>
</main>
```
