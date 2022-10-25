import { Subscriber, Unsubscriber, writable } from 'svelte/store'

class FetchableStore {
	public subscribe: (this: void, run: Subscriber<null>, invalidate?: any) => Unsubscriber
	private set: (this: void, value: null) => void
	private isFetching = writable(false)
	private initBody: { [key: string]: string }
	private abortController = new AbortController()
	private path: string
	private send: (input: RequestInfo | URL, init?: RequestInit) => Promise<any>

	constructor(path: string, initBody = {}, send) {
		const { subscribe, set } = writable(null)
		this.subscribe = subscribe
		this.set = set
		this.initBody = initBody
		this.path = path
		this.send = send
	}

	fetch(fetchBody = {}, headers = new Headers()) {
		this.isFetching.set(true)
		const body = Object.assign(this.initBody, fetchBody)
		const signal = this.abortController.signal

		this.send(this.path, { body: JSON.stringify(body), signal, headers }).then((result) => {
			this.set(result)
			this.isFetching.set(false)
		})

		return this
	}

	abort() {
		this.abortController.abort()
		this.isFetching.set(false)

		this.abortController = new AbortController()

		return this
	}

	*[Symbol.iterator]() {
		yield this
		yield this.isFetching
	};
}

export const fetchable = (send) => (path: string, initBody = {}) => new FetchableStore(path, initBody, send)
