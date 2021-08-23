import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import AppConfigs from "../../configs/app_configs"

export const typeDef = gql`
    type WebsiteUser {
        id: Int!
        discord_id: String!
        in_game_id: Int!
        permission: Int!
    }
    
    extend type Query {
        getWebUsers: [WebsiteUser]!
    }

    extend type Mutation {
        set_user_perm(id: Int!, perm: Int!): Boolean
        set_user_in_game_id(id: Int!, in_game_id: Int!): Boolean
    }
`

const WebsiteCashoutResolvers = {
    Query: {
        getWebUsers: authenticateResolver({tt: [AppConfigs.ttpermissions.ADMIN]}, (parent, args, {db}, info) => db.website.findAll())
    },
    Mutation: {
        set_user_perm: (parent, {id, perm}, {db}, info) => db.website.update({permission: perm}, {where: {id: id}}).then(() => {return true}).catch((err) => {console.error(err); return false;}),
        set_user_in_game_id: (parent, {id, in_game_id}, {db}, info) => db.website.update({in_game_id: in_game_id}, {where: {id: id}}).then(() => {return true}).catch((err) => {console.error(err); return false;})
    }
}

export default WebsiteCashoutResolvers