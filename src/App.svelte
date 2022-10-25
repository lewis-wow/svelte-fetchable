<script>
	import { fetchable } from './lib/store'
	import axios from 'axios'

	const usingAxios = (path, data, config) => axios.post(path, data, config).then((res) => res.data)
	const usingFetch = (path, data, config) => fetch(path, { ...config, body: JSON.stringify(data), method: 'POST' }).then((res) => res.json())

	const loadableAxios = fetchable(usingAxios)
	const loadableFetch = fetchable(usingFetch)

	const [resultAxios, loadingAxios] = loadableAxios('https://jsonplaceholder.typicode.com/posts')
	const [resultFetch, loadingFetch] = loadableFetch('https://jsonplaceholder.typicode.com/posts')
</script>

<main>
	<div>
		<h1>Axios</h1>
		{#if $loadingAxios}
			<span>loading...</span>
		{:else}
			<span>result: {JSON.stringify($resultAxios)}</span>
		{/if}

		<button on:click={() => resultAxios.fetch()}>Fetch</button>
		<button on:click={() => resultAxios.abort()}>Abort</button>
	</div>

	<div>
		<h1>Fetch</h1>
		{#if $loadingFetch}
			<span>loading...</span>
		{:else}
			<span>result: {JSON.stringify($resultFetch)}</span>
		{/if}

		<button on:click={() => resultFetch.fetch()}>Fetch</button>
		<button on:click={() => resultFetch.abort()}>Abort</button>
	</div>
</main>
