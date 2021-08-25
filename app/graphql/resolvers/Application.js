import {gql} from "apollo-server-express";
import {authenticateResolver} from "../../domain/auth/resolvers/authenticateResolver";
import {getActiveApplicants} from "./ApplicationQueries/GetActiveApplicants"
import AppConfigs from "../../configs/app_configs"
import {setApplicantContacted, setApplicantRejected, updateApplicantStatusInfo} from "./ApplicationQueries/SetApplicantStatus"
import { CompletedReferralsType, getCompletedReferrals, getReferralDetails, markRefAsPaid, getActiveReferrals, changeRefID, getAuthUserActiveReferrals } from "./ApplicationQueries/Referrals";

export const typeDef = gql`
    type Application {
        id: Int!
        discord_id: String!
        in_game_name: String!
        in_game_id: Int!
        referred_id: Int
        cooldown: Date
        play_per_week: String!
        company: String!
        country: String!
        why: String!
        anything: String!
        status: String!
        status_info: String
        paid: Boolean!
        updatedAt: Date!
        createdAt: Date!
    }

    type CompletedReferrals ${CompletedReferralsType}

    type ReferralDetails {
        in_game_name: String!
        in_game_id: Int!
        discord_id: String!
        total_vouchers: Int!
    }

    type ActiveReferralDetails {
        app_id: Int!
        employee_name: String!
        employee_id: Int!
        total_vouchers: Int!
        re_name: String!
        re_in_game_id: Int!
        re_discord_id: String!
    }

    type BasicActiveReferralDetails {
        app_id: Int!
        employee_name: String!
        employee_id: Int!
        total_vouchers: Int!
    }
    
    extend type Query {
        getAuthUserStatus: Application,
        getActiveApplicants: [Application]!,
        getCompletedReferrals: CompletedReferrals!,
        getReferralDetails(referred_id: Int!, paid: String!): [ReferralDetails]!,
        getActiveReferrals: [ActiveReferralDetails]!,
        getAuthUserActiveReferrals: [ActiveReferralDetails]!
    }

    extend type Mutation {
        set_applicant_contacted(id: Int!): String,
        set_applicant_rejected(id: Int!, reason: String!): Boolean,
        update_applicant_status_info(id: Int!, status_info: String!): String,
        set_ref_paid(id: Int!): Boolean,
        set_referrer_id(app_id: Int!, new_id: Int!): Boolean
    }
`

const ApplicationsResolvers = {
    Query: {
        getAuthUserStatus: authenticateResolver(null, (parent, args, {db, user}, info) => db.applications.findOne({where: {discord_id: user.id}})),
        getActiveApplicants: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db, user}, info) => getActiveApplicants(db)),
        getCompletedReferrals: authenticateResolver({app: [AppConfigs.permissions.OWNER]}, (parent, args, {db}, info) => getCompletedReferrals(db)),
        getReferralDetails: authenticateResolver({app: [AppConfigs.permissions.OWNER]}, (parent, {referred_id, paid}, {db}, info) => getReferralDetails(db, referred_id, paid)),
        getActiveReferrals: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, args, {db}, info) => getActiveReferrals(db)),
        getAuthUserActiveReferrals: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER,AppConfigs.permissions.MEMBER]}, (parent, args, {db, user}, info) => getAuthUserActiveReferrals(db, user)),
    },
    Mutation: {
        set_applicant_contacted: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {id}, {db, user}, info) => setApplicantContacted(db, user, id)),
        set_applicant_rejected: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {id, reason}, {db, user}, info) => setApplicantRejected(db, user, id, reason)),
        update_applicant_status_info: authenticateResolver({app: [AppConfigs.permissions.OWNER,AppConfigs.permissions.MANAGER]}, (parent, {id, status_info}, {db, user}, info) => updateApplicantStatusInfo(db, user, id, status_info)),
        set_ref_paid: authenticateResolver({app: [AppConfigs.permissions.OWNER]}, (parent, {id}, {db}, info) => markRefAsPaid(db, id)),
        set_referrer_id: authenticateResolver({app: [AppConfigs.permissions.OWNER]}, (parent, {app_id, new_id}, {db}, info) => changeRefID(db, app_id, new_id)),
    }
}

export default ApplicationsResolvers