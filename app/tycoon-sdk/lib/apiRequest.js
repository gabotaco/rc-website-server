// @flow
import { fetchBuilder, MemoryCache } from 'node-fetch-cache';

const zeroFetch = fetchBuilder.withCache(new MemoryCache({ttl: 50}));
const shortFetch = fetchBuilder.withCache(new MemoryCache({ttl: 2 * 60000}));
const longFetch = fetchBuilder.withCache(new MemoryCache({ttl: 10 * 60000}));

const apiRequest = (request) => {
	const {responseType} = request

	if (request.cache === 'OFF') {
		return zeroFetch(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			timeout: request.timeout
		})
		.then((response) => {
			if(response.ok) {
				if (responseType == 'TYCOON') {
					return response.text().then((html) => {
						return JSON.parse(new DOMParser().parseFromString(html, "text/html").body.innerHTML.replace(/<\/?[^>]+>/gi, ''))
					})
				} else if (responseType == 'EMPTY') {
					return true;
				} else {
					return response[responseType]()
				}
			} else {
				throw response.text().then((text) => {
					return text;
				})
			}
		})
	} else if (request.cache === 'SHORT') {
		return shortFetch(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			timeout: request.timeout
		})
		.then((response) => {
			if(response.ok) {
				if (responseType == 'TYCOON') {
					return response.text().then((html) => {
						return JSON.parse(new DOMParser().parseFromString(html, "text/html").body.innerHTML.replace(/<\/?[^>]+>/gi, ''))
					})
				} else if (responseType == 'EMPTY') {
					return true;
				} else {
					return response[responseType]()
				}
			} else {
				throw response.text().then((text) => {
					return text;
				})
			}
		})
	} else if (request.cache === 'LONG') {
		return longFetch(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			timeout: request.timeout
		})
		.then((response) => {
			if(response.ok) {
				if (responseType == 'TYCOON') {
					return response.text().then((html) => {
						return JSON.parse(new DOMParser().parseFromString(html, "text/html").body.innerHTML.replace(/<\/?[^>]+>/gi, ''))
					})
				} else if (responseType == 'EMPTY') {
					return true;
				} else {
					return response[responseType]()
				}
			} else {
				throw response.text().then((text) => {
					return text;
				})
			}
		})
	}
}

export default apiRequest
