<script>
	import { fetchable } from './lib/store'

	const post = (path, { body, signal }) => {
		const opts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			mode: 'cors',
			credentials: 'include',
			body,
			signal,
		}

		return fetch(path, opts)
			.then(async (r) => {
				if (r.status >= 200 && r.status < 400) {
					return await r.text()
				} else {
					return await r.text()
				}
			})
			.then((str) => {
				try {
					return JSON.parse(str)
				} catch (err) {
					return str
				}
			})
	}

	const loadable = fetchable(post)

	const [result, loading] = loadable('https://jsonplaceholder.typicode.com/posts')

	console.log(result, loading)
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

	<button on:click={() => result.abort()}>Abort</button>
</main>
