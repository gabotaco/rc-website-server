import { Op } from 'sequelize';

export const getPaginatedWebUsers = async (db, args, recursive) => {
	return await db.website
		.findAndCountAll({
			limit: args.limit,
			offset: args.offset < 0 ? 0 : args.offset,
			order: args.orderBy ? [[args.orderBy, 'ASC']] : [['discord_id', 'ASC']],
			where: args.textFilter
				? {
						[Op.or]: [
							{
								discord_id: {
									[Op.like]: `%${args.textFilter}%`
								}
							},
							{
								in_game_id: {
									[Op.like]: `%${args.textFilter}%`
								}
							}
						]
				  }
				: null
		})
		.then(result => {
			const rows = result.rows;

			if (rows.length == 0 && result.count > 0 && !recursive) {
				const lastPage = Math.floor(result.count / args.limit);
				return getPaginatedWebUsers(db, { ...args, offset: lastPage }, true);
			}

			return {
				rows: rows,
				count: result.count
			};
		});
};
