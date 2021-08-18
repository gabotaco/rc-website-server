import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import {getActiveApplicants} from "./ApplicationQueries/GetActiveApplicants"
import AppConfigs from "../../configs/app_configs"

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
`

const ApplicationsResolvers = {
    Query: {
        getAuthUserStatus: authenticateResolver(null, (parent, args, {db, user}, info) => db.applications.findOne({where: {discord_id: user.id}})),
        getActiveApplicants: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db, user}, info) => getActiveApplicants(db))
    }
}

export default ApplicationsResolvers