import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import {getActiveApplicants} from "./ApplicationQueries/GetActiveApplicants"
import AppConfigs from "../../configs/app_configs"
import {setApplicantContacted, setApplicantRejected, updateApplicantStatusInfo} from "./ApplicationQueries/SetApplicantStatus"

export const typeDef = gql`
    type Application {
        id: ID!
        discord_id: String!
        in_game_name: String!
        in_game_id: Int!
        referred_id: Int
        cooldown: Date
        play_per_week: String!
        company: String!
        country: String!
        why: String!
        anything: String!
        status: String!
        status_info: String
        paid: Boolean!
        updatedAt: Date!
        createdAt: Date!
    }
    
    extend type Query {
        getAuthUserStatus: Application
        getActiveApplicants: [Application]!
    }

    extend type Mutation {
        set_applicant_contacted(id: Int!): String,
        set_applicant_rejected(id: Int!, reason: String!): Boolean,
        update_applicant_status_info(id: Int!, status_info: String!): String
    }
`

const ApplicationsResolvers = {
    Query: {
        getAuthUserStatus: authenticateResolver(null, (parent, args, {db, user}, info) => db.applications.findOne({where: {discord_id: user.id}})),
        getActiveApplicants: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db, user}, info) => getActiveApplicants(db))
    },
    Mutation: {
        set_applicant_contacted: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {id}, {db, user}, info) => setApplicantContacted(db, user, id)),
        set_applicant_rejected: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {id, reason}, {db, user}, info) => setApplicantRejected(db, user, id, reason)),
        update_applicant_status_info: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {id, status_info}, {db, user}, info) => updateApplicantStatusInfo(db, user, id, status_info)),
    }
}

export default ApplicationsResolvers