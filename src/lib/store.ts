import { Subscriber, Unsubscriber, writable } from 'svelte/store'

interface FetchableStoreFetchOptions {
	body?: { [key: string | number]: any },
	headers?: Headers,
	timeout?: number
}

interface FetchableStore {
	subscribe: (this: void, run: Subscriber<any>, invalidate?: any) => Unsubscriber,
	fetch: (options: FetchableStoreFetchOptions) => FetchableStore,
	abort: () => FetchableStore
}

interface IsFetching {
	subscribe: (this: void, run: Subscriber<any>, invalidate?: any) => Unsubscriber
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

const fetchableStoreFactory = (path: string, initBody = {}, send): ExtendedArray => {
	const { subscribe, set } = writable(null)

	let abortController = new AbortController()
	const isFetching = writable(false)

	const store: FetchableStore = {
		subscribe,
		fetch(options: FetchableStoreFetchOptions) {
			isFetching.set(true)
			const fetchBody = Object.assign(initBody, options?.body)

			const signal = options?.timeout ? AbortSignal.timeout(options.timeout) : abortController.signal

			signal.addEventListener('abort', (e) => {
				isFetching.set(false)
				abortController = new AbortController()
			})

			send(path, fetchBody, {
				signal,
				headers: options?.headers
			}).then((result) => {
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

export const fetchable = (send) => (path: string, initBody = {}) => fetchableStoreFactory(path, initBody, send)
