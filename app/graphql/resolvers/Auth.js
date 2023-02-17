import AppConfigs from '../../configs/app_configs';
import { authenticateResolver } from '../../domain/auth/resolvers/authenticateResolver';
import { gql } from 'apollo-server-express';

export const typeDef = gql`
	type AuthorizedUser {
		avatar: String!
		id: String!
		username: String!
		discriminator: String!
		ttpermission: Int!
		in_game_id: Int
		permission: Int!
		permission_title: String!
		member_id: Int
		company: String
		welcome: Boolean
		in_game_name: String
	}

	extend type Query {
		authorizedUser: AuthorizedUser!
		authorizedUserRank: Int!
	}
`;

const AuthResolvers = {
	Query: {
		authorizedUser: authenticateResolver(
			null,
			(parent, args, context, info) => context.user
		),
		authorizedUserRank: authenticateResolver(
			{
				app: [
					AppConfigs.permissions.OWNER,
					AppConfigs.permissions.MANAGER,
					AppConfigs.permissions.MEMBER
				]
			},
			(parent, args, { db, user }, info) =>
				db.members
					.findOne({
						attributes: [
							[
								db.sequelize.literal(
									'(SELECT rank FROM (SELECT members.id, (RANK() OVER (ORDER BY (rts.vouchers + pigs.vouchers) DESC)) AS rank FROM `members` AS `members` LEFT OUTER JOIN `rts` AS `rts` ON `members`.`id` = `rts`.`member_id` LEFT OUTER JOIN `pigs` AS `pigs` ON `members`.`id` = `pigs`.`member_id`) r WHERE r.id=members.id)'
								),
								'rank'
							]
						],
						where: {
							id: user.member_id
						}
					})
					.then(member => member.dataValues.rank)
		)
	}
};

export default AuthResolvers;
