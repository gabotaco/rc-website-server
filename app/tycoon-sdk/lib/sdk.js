import apiRequest from "./apiRequest"

export default class Sdk {
	configs

	constructor(configs) {
		this.configs = configs
	}

	buildUrl = (request) => {
		let url = `https://${request.server}/status${request.uri}`

		return url
	}

	allServerApiCall = (request) => {
		const serverPromises = this.configs.server_order.map(server => {
			return this.apiCall({
				server: server,
				uri: '/alive',
				method: 'GET',
				cache: false,
				responseType: 'EMPTY'
			}).then(() => {
				return server
			})
		});

		return Promise.any(serverPromises).then((server) => {
			return this.apiCall({...request, server: server})
		}).catch(() => {throw new Error("Tycoon Servers Offline")})
	}

	apiCall = (request) => {
		if (!request.server) {
			return this.allServerApiCall(request);
		}

		const url = this.buildUrl(request)

		return apiRequest({
			url: url,
			method: request.method || 'GET',
			headers: this.getDefaultHeaders(),
			body: request.body,
			timeout: request.timeout || 10000,
			responseType: request.responseType || 'json',
			cache: request.cache || 'SHORT'
		})
	}

	getDefaultHeaders = () => ({
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
		'X-Tycoon-Key': this.configs.key
	})
}
