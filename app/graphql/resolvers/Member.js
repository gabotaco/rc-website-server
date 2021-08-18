import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import {CompanyMembersType, getAllMembers} from "./MemberQueries/GetAllMembers"
import {MemberProgressType, getMemberProgress} from "./MemberQueries/GetMemberProgress"
import AppConfigs from "../../configs/app_configs"

export const typeDef = gql`
    type Member {
        id: ID!
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
    }

    type MemberProgress ${MemberProgressType}

    type CompanyMembers ${CompanyMembersType}
    
    extend type Query {
        getAllMembers: CompanyMembers!
        getAuthUserProgress: MemberProgress!
    }
`

const MembersResolvers = {
    Query: {
        getAllMembers: (parent, args, {db}, info) => getAllMembers(parent, args, {db}),
        getAuthUserProgress: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => getMemberProgress(parent, args, {db, user}))
    }
}

export default MembersResolvers