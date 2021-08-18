// @flow

import apiRequest from "./apiRequest"

export default class Sdk {
	configs

	constructor(configs) {
		this.configs = configs
	}

	setConfigs = (configs) => {
		this.configs = configs
	}

	buildResponseObj = (response, responseType) => {
		return responseType === 'json'
			? response
			: {[responseType]: response}
	}

	buildUrl = (request) => {
		let url = `https://${request.server}/status${request.uri}`

		return url
	}

	allServerApiCall = (request, index) => {
		if (index >= this.configs.server_order.length) return Promise.reject(new Error("Tycoon Servers Offline"))
		request.server = this.configs.server_order[index]
		return this.apiCall(request).then((response) => {
			if (!response) throw new Error("Server Offline")
			return response;
		}).catch((err) => {
			return this.allServerApiCall(request, index + 1)
		})
	}

	apiCall = (request) => {
		if (!request.server) {
			return this.allServerApiCall(request, 0);
		}

		const url = this.buildUrl(request)

		return apiRequest({
			url:  url,
			method: request.method,
			headers: this.getDefaultHeaders(),
			body: request.body,
			timeout: request.timeout || 10000
		})
	}

	getDefaultHeaders = () => ({
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
		'X-Tycoon-Key': this.configs.key
	})
}
