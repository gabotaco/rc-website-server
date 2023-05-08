import AppConfigs from '../../configs/app_configs';
import Entity from '../Entity';
import { getItemInfo } from '../tycoon/itemInfo';
import sdk from '../../tycoon-sdk/TycoonSDK';
import { sequelize } from '../../models';

export default class Tycoon extends Entity {
	constructor(db, app, api) {
		super(db, app, api);
	}

	getPositions = async (req, res) => {
		const server = `http://v1.api.tycoon.community/${req.params.server}`;

		sdk.Server.getPositions(server)
			.then(response => {
				this.successResponse(res, response);
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getData = async (req, res) => {
		let uid = req.user.in_game_id;
		if (
			req.user.ttpermission >= AppConfigs.ttpermissions.SEARCH_OTHERS &&
			req.query.id
		) {
			uid = req.query.id;
		}
		sdk.Player.getData(uid)
			.then(response => {
				this.successResponse(res, response);
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getBiz = async (req, res) => {
		let uid = req.user.in_game_id;
		if (
			req.user.ttpermission >= AppConfigs.ttpermissions.SEARCH_OTHERS &&
			req.query.id
		) {
			uid = req.query.id;
		}

		sdk.Player.getUserBiz(uid)
			.then(response => {
				this.successResponse(res, response);
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getPlayers = async (req, res) => {
		const server = `http://v1.api.tycoon.community/${req.params.server}`;

		sdk.Server.getPlayers(server)
			.then(response => {
				this.successResponse(res, response);
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getCharges = async (req, res) => {
		sdk.Utility.getCharges()
			.then(response => {
				this.successResponse(res, response);
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getId = async (req, res) => {
		if (req.query.discord_id) {
			const webuser = await this.db.website.findOne({
				where: { discord_id: req.query.discord_id }
			});
			if (webuser) {
				return this.successResponse(res, { user_id: webuser.in_game_id });
			}
		} else if (req.user.in_game_id) {
			return this.successResponse(res, { user_id: req.user.in_game_id });
		}

		sdk.Utility.snowflake2user(
			req.query.discord_id ? req.query.discord_id : req.user.id
		)
			.then(async user_id => {
				this.successResponse(res, { user_id: user_id });
				if (user_id) {
					await this.db.website.create({
						discord_id: req.query.discord_id
							? req.query.discord_id
							: req.user.id,
						in_game_id: user_id
					});
				}
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getCurrentVehicles = async (req, res) => {
		let uid = req.user.in_game_id;
		sdk.Player.getCurrentVehicles(uid)
			.then(response => {
				this.successResponse(res, response);
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getBackpack = async (req, res) => {
		let uid = req.user.in_game_id;
		if (
			req.user.ttpermission >= AppConfigs.ttpermissions.SEARCH_OTHERS &&
			req.query.id
		) {
			uid = req.query.id;
		}
		sdk.Player.getStorage(`u${uid}backpack`, uid)
			.then(response => {
				this.successResponse(res, response);
			})
			.catch(err => {
				this.errorResponse(res, err.message);
			});
	};

	getStorages = async (req, res) => {
		let uid = req.user.in_game_id;
		if (
			req.user.ttpermission >= AppConfigs.ttpermissions.SEARCH_OTHERS &&
			req.query.id
		) {
			uid = req.query.id;
		}

		const data = await Promise.all([
			await sdk.Player.getAllStorages(uid),
			await sdk.Player.getData(uid),
			await sdk.Player.getStorage(`u${uid}backpack`, uid)
		]).catch(err => {
			return this.errorResponse(res, err.message);
		});

		if (
			typeof data[0] !== 'object' ||
			typeof data[1] !== 'object' ||
			typeof data[2] !== 'object'
		)
			return this.errorResponse(res, data);

		let [
			{ storages },
			{
				data: {
					inventory,
					licenses,
					groups,
					gaptitudes_v: {
						physical: { strength }
					}
				}
			},
			{ data: backpack }
		] = data;

		// Add inventory and backpack to storages
		storages = [
			{ name: 'inventory', inventory },
			{ name: 'backpack', inventory: backpack },
			...storages
		];

		try {
			for (const storage of storages) {
				const promises = [];
				const inventory = [];

				Object.keys(storage.inventory).forEach(async key => {
					promises.push(getItemInfo(key));
				});

				await Promise.allSettled(promises).then(result => {
					result.forEach(itemResult => {
						const item = itemResult.value;
						inventory.push({
							name: item.id,
							dName: item.name,
							amount: storage.inventory[item.id].amount || 1,
							weight: item.weight || 0
						});
					});
				});

				storage.inventory = inventory;
			}

			this.successResponse(res, { storages, licenses, groups, strength });
		} catch (err) {
			this.errorResponse(res, err.message);
		}
	};
}
