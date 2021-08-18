import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";

export const typeDef = gql`
    type PigsCashout {
        id: ID!
        member_id: Int!
        vouchers: Int
        worth: Int!
        updatedAt: Date!
        createdAt: Date!
    }

    type PigsCashoutInfo {
        pigsCashout: PigsCashout
        member: Member
    }
`

const PigsCashoutResolvers = {
    Query: {
    }
}

export default PigsCashoutResolvers