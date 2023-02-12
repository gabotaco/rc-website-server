export const RankedMembersType = `
    {
        id: Int!
        rank: Int!
        discord_id: String!
        in_game_name: String!
        in_game_id: Int!
        company: String!
        last_turnin: Date
        vouchers_turned_in: Int!
        pigs: PigsCashout!
        rts: RtsCashout!
    }
`;

import { Op } from 'sequelize';

export const getPaginatedMemberRankings = (db, args, user, recursive) => {
	return db.members
		.findAndCountAll({
			include: [
				{
					model: db.rts,
					as: 'rts'
				},
				{
					model: db.pigs,
					as: 'pigs'
				}
			],
			attributes: [
				'id',
				'rank',
				'discord_id',
				'in_game_name',
				'in_game_id',
				'company',
				'last_turnin'
			],
			order: [['rank', 'ASC']],
			limit: args.limit,
			offset: args.offset < 0 ? 0 : args.offset,
			where: args.textFilter
				? {
						[Op.or]: [
							{
								in_game_name: {
									[Op.like]: `%${args.textFilter}%`
								}
							},
							{
								in_game_id: {
									[Op.like]: `%${args.textFilter}%`
								}
							},

							{
								'$rts.vouchers$': {
									[Op.like]: `%${args.textFilter}%`
								}
							},
							{
								'$pigs.vouchers$': {
									[Op.like]: `%${args.textFilter}%`
								}
							}
						]
				  }
				: true
		})
		.then(result => {
			const response = [];
			const rows = result.rows;

			if (rows.length == 0 && result.count > 0 && !recursive) {
				const lastPage = Math.ceil(result.count / args.limit);
				return getPaginatedMemberRankings(
					db,
					{ ...args, offset: lastPage },
					user,
					true
				);
			}

			for (let i = 0; i < rows.length; i++) {
				response.push({
					id: rows[i].id,
					rank: rows[i].rank,
					discord_id: rows[i].discord_id,
					in_game_name: rows[i].in_game_name,
					in_game_id: rows[i].in_game_id,
					company: rows[i].company,
					last_turnin:
						rows[i].id == user.member_id ? rows[i].last_turnin : null,
					vouchers_turned_in: rows[i].pigs.vouchers + rows[i].rts.vouchers,
					pigs: rows[i].pigs,
					rts: rows[i].rts
				});
			}

			return { rows: response, count: result.count };
		});
};
