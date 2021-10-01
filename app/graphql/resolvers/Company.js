import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import AppConfigs from "../../configs/app_configs"
import { getTopTurnins } from "./CompanyQueries/TopTurnins";

export const typeDef = gql`
    type TopTurnin {
        in_game_name: String!
        in_game_id: Int!
        place: Int!
        vouchers: Int!
        money: Int!
    }
    
    extend type Query {
        getTopTurnins (num_players: Int!, from: String!, to: String!, company: String!): [TopTurnin]!
    }
`

const ApplicationsResolvers = {
    Query: {
        getTopTurnins: authenticateResolver({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER]}, (parent, {num_players, from, to, company}, {db}, info) => getTopTurnins(db, num_players, from, to, company)),
    }
}

export default ApplicationsResolvers