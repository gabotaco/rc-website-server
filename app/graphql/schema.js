import {typeDef as ApplicationType} from './resolvers/Application'
import {typeDef as ManagerType} from './resolvers/Manager'
import {typeDef as MemberType} from './resolvers/Member'
import {typeDef as PayoutType} from './resolvers/Payout'
import {typeDef as PigsType} from './resolvers/Pigs'
import {typeDef as RtsType} from './resolvers/Rts'
import {typeDef as WebsiteType} from './resolvers/Website'
import {typeDef as AuthType} from './resolvers/Auth'
import {gql} from "apollo-server-express";

// graphql won't allow an empty type, so we give it a single empty param
const Query = gql`
    type Query {
        _empty: String
    }
`

const Mutation = gql`
    type Mutation {
        _empty: String
    }
`
export const typeDefs = gql`
    scalar Date,
    scalar JSON,
    ${Query},
    ${Mutation},
    ${ApplicationType},
    ${ManagerType},
    ${MemberType},
    ${PayoutType},
    ${PigsType},
    ${RtsType},
    ${WebsiteType},
    ${AuthType}
`