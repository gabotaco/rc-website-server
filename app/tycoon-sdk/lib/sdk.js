import apiRequest from "./apiRequest";
import db from "../../models/index";

const playerKeys = {};
export default class Sdk {
	configs;

	constructor(configs) {
		this.configs = configs;
	}

	buildUrl = request => {
		return `${request.server}${request.uri}`;
	};

	allServerApiCall = request => {
		const serverPromises = this.configs.server_order.map(server => {
			return this.apiCall({
				server: server,
				uri: "/charges.json",
				method: "GET",
				cache: false,
				responseType: "json"
			}).then(() => {
				return server;
			});
		});

		return Promise.any(serverPromises)
			.then(server => {
				return this.apiCall({ ...request, server: server });
			})
			.catch(err => {
				throw new Error("Tycoon Servers Offline");
			});
	};

	apiCall = async request => {
		if (!request.server) {
			return this.allServerApiCall(request);
		}

		const url = this.buildUrl(request);
		const headers = this.getDefaultHeaders();

		if (request.public_key && request.user_id) {
			await this.getPlayerPublicKey(request.user_id).then(public_key => {
				headers["X-Tycoon-Public-Key"] = public_key;
			});
		}

		return apiRequest({
			url: url,
			method: request.method || "GET",
			headers: headers,
			body: request.body,
			timeout: request.timeout || 10000,
			responseType: request.responseType || "json",
			cache: request.cache || "SHORT"
		})
			.then(response => {
				return response;
			})
			.catch(err => {
				if (err instanceof Promise)
					return err.then(response => response).catch(err => err.code);
				throw new Error(err.message);
			});
	};

	getDefaultHeaders = () => ({
		Accept: "application/json",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
		"X-Tycoon-Key": this.configs.key
	});

	getPlayerPublicKey = async user_id => {
		if (playerKeys[user_id] && playerKeys[user_id].public_key) {
			if (playerKeys[user_id].expires > Date.now()) {
				return playerKeys[user_id].public_key;
			}
		}

		return await db.website
			.findOne({ where: { in_game_id: user_id } })
			.then(member => {
				if (member) {
					playerKeys[user_id] = {
						public_key: member.dataValues.public_key,
						ttl: Date.now() + 1000 * 60 * 60
					};
					return member.dataValues.public_key;
				}
				return null;
			});
	};

	setPublicKeyCache = async (user_id, public_key) => {
		playerKeys[user_id] = {
			public_key: public_key,
			ttl: Date.now() + 1000 * 60 * 60
		};
	};
}
