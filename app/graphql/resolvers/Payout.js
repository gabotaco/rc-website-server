import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import AppConfigs from "../../configs/app_configs"

export const typeDef = gql`
    type Payout {
        id: ID!
        manager_id: Int!
        member_id: Int!
        company: String!
        amount: Int!
        worth: Int!
        updatedAt: Date!
        createdAt: Date!
    }

    type PayoutInfo {
        id: ID!
        manager_id: Int!
        member_id: Int!
        company: String!
        amount: Int!
        worth: Int!
        updatedAt: Date!
        createdAt: Date!
        member: Member!
        manager: ManagerInfo!
    }
    
    extend type Query {
        getAuthUserTurnins: [PayoutInfo]!
        getAuthUserPayouts: [PayoutInfo]!
    }
`

const PayoutsResolvers = {
    Query: {
        getAuthUserTurnins: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => db.payout.findAll({ 
            include: {all: true, nested: true },
            where: {member_id: user.member_id}})
        ),
        getAuthUserPayouts: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db, user}, info) => db.payout.findAll({ 
            include: {all: true, nested: true },
            where: {manager_id: user.manager_id}})
        )
    }
}

export default PayoutsResolvers