import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import AppConfigs from "../../configs/app_configs"

export const typeDef = gql`
    type PigsCashout {
        id: Int!
        member_id: Int!
        vouchers: Float
        worth: Float!
        updatedAt: Date!
        createdAt: Date!
    }

    type PigsCashoutInfo {
        pigsCashout: PigsCashout
        member: Member
    }

    extend type Query {
        getAuthUserPigsVouchers: PigsCashout!
    }
`

const PigsCashoutResolvers = {
    Query: {
        getAuthUserPigsVouchers: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => db.pigs.findOne({where: {member_id: user.member_id}}))
    }
}

export default PigsCashoutResolvers