import { authenticateResolver } from '../../domain/auth/resolvers/authenticateResolver';
import { gql } from 'apollo-server-express';

export const typeDef = gql`
	type AuthorizedUser {
		avatar: String!
		id: String!
		rank: Int!
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
	}
`;

const AuthResolvers = {
	Query: {
		authorizedUser: authenticateResolver(
			null,
			(parent, args, context, info) => context.user
		)
	}
};

export default AuthResolvers;
