import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import AppConfigs from "../../configs/app_configs"

export const typeDef = gql`
    type Manager {
        id: ID!
        member_id: Int!
        rts_cashout: Int!
        rts_cashout_worth: Int!
        pigs_cashout: Int!
        pigs_cashout_worth: Int!
        total_money: Int!
        active: Boolean!
        updatedAt: Date!
        createdAt: Date!
    }

    type ManagerInfo {
        manager: Manager!
        member: Member!
    }
    
    extend type Query {
        getAuthUserCashout: Manager!
    }
`

const ManagersResolvers = {
    Query: {
        getAuthUserCashout: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db, user}, info) => db.managers.findByPk(user.manager_id))
    }
}

export default ManagersResolvers