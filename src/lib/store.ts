import { writable } from 'svelte/store'

const post = (path: string, body: any = null) => {
	const opts: RequestInit = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors',
		credentials: 'include',
	}

	if (body) {
		opts.body = JSON.stringify(body)
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

class FetchArray extends Array {
	caller: (fetchBody, then) => void

	constructor(items, caller = () => { }) {
		super()
		this.push(...items)
		this.caller = caller
	}

	setFetch(caller) {
		this.caller = caller
		return this
	}

	fetch(fetchBody = {}, then = () => { }) {
		return this.caller(fetchBody, then)
	}
}

export const fetchable = (path: string, initBody = {}, send = post) => {
	const { subscribe, set } = writable(null)

	return {
		subscribe,
		fetch(fetchBody = {}, then = (result) => { }) {
			const body = Object.assign(initBody, fetchBody)

			send(path, body).then((result) => {
				set(result)
				then(result)
			})

			return this
		}
	}
}

export const loadable = (path: string, initBody = {}, send = post) => {
	const fetcher = fetchable(path, initBody, send)
	const fetchCaller = fetcher.fetch

	const isFetching = writable(false)

	fetcher.fetch = (fetchBody = {}, then = () => null) => {
		isFetching.set(true)

		fetchCaller(fetchBody, (result) => {
			isFetching.set(false)
			then(result)
		})

		return new FetchArray([fetcher, isFetching], fetcher.fetch)
	}

	return new FetchArray([fetcher, isFetching], fetcher.fetch)
}
