// @flow

import Entity from '../lib/entity';

export default class Data extends Entity {
	constructor(makeApiRequest) {
		super(makeApiRequest);
	}

	snowflake2user = discord_id => {
		return this.makeApiRequest({
			uri: `/snowflake2user/${discord_id}`,
			method: 'GET',
			cache: 'SHORT'
		}).then(response => {
			if (response.user_id) return response.user_id;
			return null;
		});
	};

	getCharges = () => {
		return this.makeApiRequest({
			uri: '/charges.json',
			timeout: 2000,
			method: 'GET',
			cache: 'OFF'
		});
	};

	getItem = item_id => {
		return this.makeApiRequest({
			uri: `/iteminfo/${item_id}`,
			method: 'GET',
			cache: 'LONG'
		});
	};
}
