import {
	CompanyMemberDetailType,
	getPaginatedAllMemberDetails
} from './PagedQueries/GetPaginatedAllMemberDetails';
import {
	RankedMembersType,
	getPaginatedMemberRankings
} from './PagedQueries/GetPaginatedMemberRankings';

import AppConfigs from '../../configs/app_configs';
import { authenticateResolver } from '../../domain/auth/resolvers/authenticateResolver';
import { getPaginatedWebUsers } from './PagedQueries/GetPaginatedWebUsers';
import { gql } from 'apollo-server-express';

export const typeDef = gql`
	type WebsiteUser {
		id: Int!
		discord_id: String!
		in_game_id: Int!
		permission: Int!
	}

	type CompanyMemberDetail
	${CompanyMemberDetailType}

	type RankedMember
	${RankedMembersType}

	type PaginatedCompanyMemberDetails {
		rows: [CompanyMemberDetail]!
		count: Int!
	}

	type PaginatedRankedMembers {
		rows: [RankedMember]!
		count: Int!
	}

	type PaginatedWebUsers {
		rows: [WebsiteUser]!
		count: Int!
	}

	extend type Query {
		getPaginatedAllMemberDetails(
			limit: Int!
			offset: Int!
			textFilter: String
			orderBy: String
			filter: String
		): PaginatedCompanyMemberDetails!
		getPaginatedMemberRankings(
			limit: Int!
			offset: Int!
			textFilter: String
			orderBy: String
		): PaginatedRankedMembers!

		getTotalMembers: Int!

		getPaginatedWebUsers(
			limit: Int!
			offset: Int!
			textFilter: String
			orderBy: String
		): PaginatedWebUsers!

		getTotalWebUsers: Int!
	}
`;

const MembersResolvers = {
	Query: {
		getPaginatedAllMemberDetails: authenticateResolver(
			{ app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER] },
			(parent, args, { db, user }, info) =>
				getPaginatedAllMemberDetails(db, args)
		),
		getPaginatedMemberRankings: authenticateResolver(
			{
				app: [
					AppConfigs.permissions.OWNER,
					AppConfigs.permissions.MANAGER,
					AppConfigs.permissions.MEMBER
				]
			},
			(parent, args, { db, user }, info) =>
				getPaginatedMemberRankings(db, args, user)
		),
		getTotalMembers: authenticateResolver(
			{
				app: [
					AppConfigs.permissions.OWNER,
					AppConfigs.permissions.MANAGER,
					AppConfigs.permissions.MEMBER
				]
			},
			(parent, args, { db, user }, info) => db.members.count()
		),
		getPaginatedWebUsers: authenticateResolver(
			{ tt: [AppConfigs.ttpermissions.ADMIN] },
			(parent, args, { db }, info) => getPaginatedWebUsers(db, args)
		),
		getTotalWebUsers: authenticateResolver(
			{ tt: [AppConfigs.ttpermissions.ADMIN] },
			(parent, args, { db }, info) => db.website.count()
		)
	}
};

export default MembersResolvers;
