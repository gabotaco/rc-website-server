import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";

export const typeDef = gql`
    type RtsCashout {
        id: ID!
        member_id: Int!
        vouchers: Int!
        worth: Int!
        updatedAt: Date!
        createdAt: Date!
    }

    type RtsCashoutInfo {
        rtsCashout: RtsCashout
        member: Member
    }
`

const RtsCashoutResolvers = {
    Query: {
    }
}

export default RtsCashoutResolvers