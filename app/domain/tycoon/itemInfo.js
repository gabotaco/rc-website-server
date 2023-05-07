import db, { sequelize } from '../../models';

import sdk from '../../tycoon-sdk/TycoonSDK';

const items = {};

export const getItemInfo = async item_id => {
	if (items[item_id]) return items[item_id];

	let dbItem = await db.items
		.findOne({
			where: {
				id: sequelize.escape(item_id).replaceAll(/\\/g, '')
			}
		})
		.then(item => {
			if (item) {
				items[item_id] = {
					id: item_id,
					name: item.name,
					weight: item.weight
				};
				return {
					id: item_id,
					name: item.name,
					weight: item.weight
				};
			}
		})
		.catch(err => {
			console.log('Error getting item info from db: ', err);
		});

	if (dbItem) return dbItem;

	const apiItem = await sdk.Utility.getItem(item_id).then(async item => {
		if (!item || !item.exists) {
			return {
				id: item_id,
				weight: 0
			};
		}

		items[item_id] = {
			id: item_id,
			name: item.name,
			weight: item.weight
		};

		await db.items
			.create({
				id: sequelize.escape(item_id).replaceAll(/\\/g, ''),
				name: item.name,
				weight: item.weight
			})
			.catch(err => {
				console.log(err);
			});

		return {
			id: item_id,
			name: item.name,
			weight: item.weight
		};
	});

	if (apiItem) return apiItem;

	return {
		id: item_id,
		name: `Unknown Item ${item_id}`,
		weight: 0
	};
};
