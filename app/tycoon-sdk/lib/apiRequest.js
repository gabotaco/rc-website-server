// @flow
import { fetchBuilder, MemoryCache } from 'node-fetch-cache';

const fetch = fetchBuilder.withCache(new MemoryCache({ttl: 2 * 60000}));

const apiRequest = (request) => {
	const {responseType} = request

	return fetch(request.url, {
		method: request.method,
		headers: request.headers,
		body: request.body,
		timeout: request.timeout
	})
	.then((response) => {
		if (request.cache === false) {
			response.ejectFromCache();
		}

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

export default apiRequest
