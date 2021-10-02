import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import AppConfigs from "../../configs/app_configs"

export const typeDef = gql`
    type Manager {
        id: Int!
        member_id: Int!
        rts_cashout: Int!
        rts_cashout_worth: Float!
        pigs_cashout: Int!
        pigs_cashout_worth: Float!
        total_money: Float!
        active: Boolean!
        updatedAt: Date!
        createdAt: Date!
    }

    type ManagerInfo {
        id: Int!
        member_id: Int!
        rts_cashout: Int!
        rts_cashout_worth: Float!
        pigs_cashout: Int!
        pigs_cashout_worth: Float!
        total_money: Float!
        active: Boolean!
        updatedAt: Date!
        createdAt: Date!
        member: Member!
    }
    
    extend type Query {
        getAuthUserCashout: Manager!,
        getActiveManagers: [ManagerInfo]!
        getAllManagers: [ManagerInfo]!
    }
`

const ManagersResolvers = {
    Query: {
        getAuthUserCashout: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db, user}, info) => db.managers.findByPk(user.manager_id)),
        getActiveManagers: authenticateResolver({app: [AppConfigs.permissions.OWNER]}, (parent, args, {db}, info) => db.managers.findAll({ 
            include: [{ model: db.members, as: 'member' }],
            where: {active: true}})
        ),
        getAllManagers: authenticateResolver({app: [AppConfigs.permissions.OWNER]}, (parent, args, {db}, info) => db.managers.findAll({ 
            include: [{ model: db.members, as: 'member' }],
            })
        )
    }
}

export default ManagersResolvers