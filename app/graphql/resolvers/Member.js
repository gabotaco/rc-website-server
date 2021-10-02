import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import {CompanyMembersType, getAllMembers} from "./MemberQueries/GetAllMembers"
import {MemberProgressType, getMemberProgress} from "./MemberQueries/GetMemberProgress"
import { RankedMembersType, getMemberRankings } from "./MemberQueries/GetMemberRankings";
import AppConfigs from "../../configs/app_configs"
import { Op } from "sequelize";

export const typeDef = gql`
    type Member {
        id: Int!
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

    type RankedMember ${RankedMembersType}
    
    extend type Query {
        getAllMembers: CompanyMembers!
        getMemberRankings: [RankedMember]!
        getAuthUserProgress: MemberProgress!
        getCurrentEmployees: [Member]!
    }
`

const MembersResolvers = {
    Query: {
        getAllMembers: (parent, args, {db}, info) => getAllMembers(parent, args, {db}),
        getMemberRankings: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => getMemberRankings(db, user)),
        getCurrentEmployees: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db}, info) => db.members.findAll({where: {company: { [Op.ne]: 'fired' }}})),
        getAuthUserProgress: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => getMemberProgress(parent, args, {db, user}))
    }
}

export default MembersResolvers