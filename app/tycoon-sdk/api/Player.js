// @flow

import Entity from '../lib/entity';

export default class Player extends Entity {
	constructor(makeApiRequest) {
		super(makeApiRequest);
	}

	getUserBiz = uid => {
		return this.makeApiRequest({
			uri: `/getuserbiz/${uid}`,
			method: 'GET',
			cache: 'SHORT'
		});
	};

	getOwnedVehicles = uid => {
		return this.makeApiRequest({
			uri: `/ownedvehicles/${uid}`,
			method: 'GET',
			cache: 'SHORT'
		});
	};

	getDataBasic = uid => {
		return this.makeApiRequest({
			uri: `/data/${uid}`,
			method: 'GET',
			cache: 'SHORT'
		});
	};

	getData = uid => {
		return this.makeApiRequest({
			uri: `/dataadv/${uid}`,
			method: 'GET',
			cache: 'SHORT'
		});
	};

	getWealth = uid => {
		return this.makeApiRequest({
			uri: `/wealth/${uid}`,
			method: 'GET',
			cache: 'SHORT'
		});
	};

	getStorage = storageid => {
		return this.makeApiRequest({
			uri: `/chest/${storageid}`,
			method: 'GET',
			cache: 'LONG'
		});
	};

	getAllStorage = uid => {
		return this.makeApiRequest({
			uri: `/storages/${uid}`,
			method: 'GET',
			cache: 'LONG'
		});
	};

	getCurrentVehicles = uid => {
		return this.makeApiRequest({
			server: 'http://v1.api.tycoon.community/main',
			uri: '/widget/players.json',
			method: 'GET',
			timeout: 2000,
			cache: 'SHORT'
		})
			.then(data => {
				if (data.players.find(player => player[2] === uid)) {
					return this.makeApiRequest({
						server: 'http://v1.api.tycoon.community/main',
						uri: '/companies/rts/ground.json',
						method: 'GET',
						cache: 'QUICK',
						public_key: true,
						user_id: uid
					});
				} else {
					return this.makeApiRequest({
						server: 'http://v1.api.tycoon.community/beta',
						uri: '/companies/rts/ground.json',
						method: 'GET',
						cache: 'QUICK',
						public_key: true,
						user_id: uid
					});
				}
			})
			.catch(err => {
				console.log(err);
			});
	};

	getStorages = uid => {
		return this.makeApiRequest({
			uri: `/storages/${uid}`,
			method: 'GET',
			cache: 'SHORT'
		});
	};
}
