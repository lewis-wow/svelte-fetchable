# Cofein (svelte fetchable)

```bash
npm i svelte-fetchable
```

## Svelte fetchable using Axios

```svelte
<script>
  import { fetchable } from 'cofein'
  const loadable = fetchable((path, data, config) => 
    axios.post(path, data, config).then((res) => res.data)
  )

  const [result, loading] = loadable('https://jsonplaceholder.typicode.com/posts')
</script>

<main>
  <div>
    <p>
      {#if $loading}
        <span>loading...</span>
      {:else}
        <span>result: {JSON.stringify($result)}</span>
      {/if}
    </p>

    <button on:click={() => result.fetch()}>Fetch</button>
    <button on:click={() => result.abort()}>Abort</button>
  </div>
</main>
```

## Svelte fetchable using fetch

```svelte
<script>
  import { fetchable } from 'cofein'
  const loadable = fetchable((path, data, config) => fetch(path, { 
      ...config, 
      body: JSON.stringify(data), 
      method: 'POST' 
    }).then((res) => res.json())
  )

  const [result, loading] = loadable('https://jsonplaceholder.typicode.com/posts')
</script>

<main>
  <div>
    <p>
      {#if $loading}
        <span>loading...</span>
      {:else}
        <span>result: {JSON.stringify($result)}</span>
      {/if}
    </p>

    <button on:click={() => result.fetch()}>Fetch</button>
    <button on:click={() => result.abort()}>Abort</button>
  </div>
</main>
```
