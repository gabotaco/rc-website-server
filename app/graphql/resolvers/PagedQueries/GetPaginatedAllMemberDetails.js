export const CompanyMemberDetailType = `
    {
        id: Int!
        rank: Int!
        discord_id: String!
        in_game_name: String!
        in_game_id: Int!
        company: String!
        deadline: Date!
        fire_reason: String
        last_turnin: Date!
        warnings: Int!
        welcome: Boolean!
        updatedAt: Date!
        createdAt: Date!
        pigs: PigsCashout!
        rts: RtsCashout!
        vouchers_turned_in: Int!
        pigs_rank: String!
        rts_rank: String!
        manager: Boolean!
    }
`;

function rtsRank(MemberDetails) {
	if (MemberDetails.rts.vouchers < 9600) {
		//Initiate
		return 'Initiate';
	} else if (MemberDetails.rts.vouchers < 24000) {
		//Lead Foot
		return 'Lead Foot';
	} else if (MemberDetails.rts.vouchers < 52800) {
		//Wheelman
		return 'Wheelman';
	} else if (MemberDetails.rts.vouchers < 117600) {
		//Legendary
		return 'Legendary Wheelman';
	} else {
		//speed demon
		return 'Speed Demon';
	}
}

function pigsRank(MemberDetails) {
	if (MemberDetails.pigs.vouchers < 6000) {
		//Hustler
		return 'Hustler';
	} else if (MemberDetails.pigs.vouchers < 18000) {
		//Pickpocket
		return 'Pickpocket';
	} else if (MemberDetails.pigs.vouchers < 38000) {
		//Thief
		return 'Thief';
	} else if (MemberDetails.pigs.vouchers < 68000) {
		//Lawless
		return 'Lawless';
	} else if (MemberDetails.pigs.vouchers < 150000) {
		//Mastermind
		return 'Criminal Mastermind';
	} else {
		return 'Overlord';
	}
}

import { Op } from 'sequelize';

export const getPaginatedAllMemberDetails = (db, args, recursive) => {
	const companyFilters = args.filter.split('|');
	return db.managers
		.findAll({
			where: {
				active: true
			}
		})
		.then(result => {
			const managerIDs = [];
			result.forEach(manager => {
				managerIDs.push(manager.member_id);
			});

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
					attributes: {
						include: [
							[
								db.sequelize.literal(
									'(SELECT rank FROM (SELECT members.id, (RANK() OVER (ORDER BY (rts.vouchers + pigs.vouchers) DESC)) AS `rank` FROM `members` AS `members` LEFT OUTER JOIN `rts` AS `rts` ON `members`.`id` = `rts`.`member_id` LEFT OUTER JOIN `pigs` AS `pigs` ON `members`.`id` = `pigs`.`member_id`) r WHERE r.id=members.id)'
								),
								'rank'
							]
						]
					},

					order: [[db.sequelize.literal('rank'), 'ASC']],
					limit: args.limit ? args.limit : 10,
					offset: args.offset < 0 ? 0 : args.offset,
					where:
						args.textFilter || args.filter
							? {
									[Op.or]: [
										{
											in_game_id: {
												[Op.like]: `%${args.textFilter}%`
											}
										},
										{
											in_game_name: {
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
										},
										{
											company: {
												[Op.like]: `%${args.textFilter}%`
											}
										}
									],
									company: {
										[Op.in]: companyFilters
									}
							  }
							: true
				})
				.then(result => {
					const response = [];
					const rows = result.rows;

					if (rows.length == 0 && result.count > 0 && !recursive) {
						const lastPage = Math.ceil(result.count / args.limit);
						return getPaginatedAllMemberDetails(
							db,
							{ ...args, page: lastPage },
							true
						);
					}

					rows.forEach(row => {
						response.push({
							id: row.dataValues.id,
							rank: row.dataValues.rank,
							discord_id: row.dataValues.discord_id,
							in_game_name: row.dataValues.in_game_name,
							in_game_id: row.dataValues.in_game_id,
							company: row.dataValues.company,
							deadline: row.dataValues.deadline,
							fire_reason: row.dataValues.fire_reason,
							last_turnin: row.dataValues.last_turnin,
							warnings: row.dataValues.warnings,
							welcome: row.dataValues.welcome,
							updatedAt: row.dataValues.updatedAt,
							createdAt: row.dataValues.createdAt,
							pigs: row.dataValues.pigs,
							rts: row.dataValues.rts,
							vouchers_turned_in:
								row.dataValues.pigs.vouchers + row.dataValues.rts.vouchers,
							pigs_rank: pigsRank(row.dataValues),
							rts_rank: rtsRank(row.dataValues),
							manager: managerIDs.includes(row.dataValues.id)
						});
					});

					return { rows: response, count: result.count };
				});
		});
};
