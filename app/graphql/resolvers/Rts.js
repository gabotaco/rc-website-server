import {gql} from "apollo-server-express";

export const typeDef = gql`
    type RtsCashout {
        id: Int!
        member_id: Int!
        vouchers: Float!
        worth: Float!
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