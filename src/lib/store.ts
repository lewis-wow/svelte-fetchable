import { Subscriber, Unsubscriber, writable } from 'svelte/store'

interface FetchableStore {
	subscribe: (this: void, run: Subscriber<any>, invalidate?: any) => Unsubscriber,
	fetch: (body: {} | null) => FetchableStore,
	abort: () => FetchableStore
}

interface IsFetching {
	subscribe: (this: void, run: Subscriber<any>, invalidate?: any) => Unsubscriber
}

interface FetchOptions {
	cache?: RequestCache
	credentials?: RequestCredentials
	headers?: HeadersInit
	integrity?: string
	keepalive?: boolean
	method?: string
	mode?: RequestMode
	redirect?: RequestRedirect
	referrer?: string
	referrerPolicy?: ReferrerPolicy
	window?: null
	timeout?: number
}

class ExtendedArray extends Array {
	constructor(values = [], methods = {}) {
		super()
		this.push(...values)

		for (const [k, v] of Object.entries(methods)) {
			this[k] = v
		}
		Object.freeze(this)
	}
}

const fetchable = <T>(path: string, options: FetchOptions = {}, fetch = window.fetch): ExtendedArray => {
	const { subscribe, set } = writable<T>(null)

	let abortController = new AbortController()
	const isFetching = writable(false)

	const store: FetchableStore = {
		subscribe,
		fetch(body: {} | null = {}) {
			isFetching.set(true)

			const signal = options?.timeout ? AbortSignal.timeout(options.timeout) : abortController.signal
			delete options.timeout

			signal.addEventListener('abort', (e) => {
				isFetching.set(false)
				abortController = new AbortController()
			})

			fetch(path, {
				...options,
				signal,
				body: JSON.stringify(body),
			}).then((result) => result.json()).then((result: T) => {
				set(result)
				isFetching.set(false)
			})

			return this
		},
		abort() {
			abortController.abort()
			return this
		}
	}

	const isFetchingStore: IsFetching = {
		subscribe: isFetching.subscribe
	}

	return new ExtendedArray([store, isFetchingStore], { fetch: store.fetch, abort: store.abort })
}

export default fetchable
export { fetchable }
