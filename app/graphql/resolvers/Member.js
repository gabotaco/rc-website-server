import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import {CompanyMembersType, getAllMembers} from "./MemberQueries/GetAllMembers"
import {MemberProgressType, getMemberProgress} from "./MemberQueries/GetMemberProgress"
import { RankedMembersType, getMemberRankings } from "./MemberQueries/GetMemberRankings";
import { CompanyMemberDetailType, getAllMemberDetails } from "./MemberQueries/getAllMemberDetails";
import { changeMemberIdentifiers } from "./MemberQueries/SetIdentifiers";
import AppConfigs from "../../configs/app_configs"
import { Op } from "sequelize";
import { setManager, setCompany, fireMember, setDeadline, setWelcome } from "./MemberQueries/SetCompany";

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

    type CompanyMemberDetail ${CompanyMemberDetailType}

    type RankedMember ${RankedMembersType}
    
    extend type Query {
        getAllMembers: CompanyMembers!
        getAllMemberDetails: [CompanyMemberDetail]!
        getMemberRankings: [RankedMember]!
        getAuthUserProgress: MemberProgress!
        getCurrentEmployees: [Member]!
    }

    extend type Mutation {
        set_member_identifiers(uid: Int!, new_name: String!, new_id: Int!, new_discord: String!): Boolean!
        set_member_manager(uid: Int!, manager: Boolean!): CompanyMemberDetail!
        set_member_company(uid: Int!, company: String!): CompanyMemberDetail!
        fire_member(uid: Int!, reason: String!, welcome: Boolean!): CompanyMemberDetail!
        set_member_deadline(uid: Int!, deadline: String!): CompanyMemberDetail!
        set_member_welcome(uid: Int!, welcome: Boolean!): CompanyMemberDetail!
    }
`

const MembersResolvers = {
    Query: {
        getAllMembers: (parent, args, {db}, info) => getAllMembers(parent, args, {db}),
        getAllMemberDetails: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db, user}, info) => getAllMemberDetails(db)),
        getMemberRankings: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => getMemberRankings(db, user)),
        getCurrentEmployees: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db}, info) => db.members.findAll({where: {company: { [Op.ne]: 'fired' }}})),
        getAuthUserProgress: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => getMemberProgress(parent, args, {db, user}))
    },
    Mutation: {
        set_member_identifiers: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {uid, new_name, new_id, new_discord}, {db, user}, info) => changeMemberIdentifiers(db, user, uid, new_name, new_id, new_discord)),
        set_member_manager: authenticateResolver({app: [AppConfigs.permissions.OWNER]}, (parent, {uid, manager}, {db}, info) => setManager(db, uid, manager)),
        set_member_company: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {uid, company}, {db, user}, info) => setCompany(db, user, uid, company)),
        fire_member: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {uid, reason, welcome}, {db, user}, info) => fireMember(db, user, uid, reason, welcome)),
        set_member_deadline: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {uid, deadline}, {db, user}, info) => setDeadline(db, user, uid, deadline)),
        set_member_welcome: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {uid, welcome}, {db, user}, info) => setWelcome(db, user, uid, welcome)),
    }
}

export default MembersResolvers