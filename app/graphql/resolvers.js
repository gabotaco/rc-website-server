import {combineResolvers} from "./lib/combineResolvers";
import ApplicationsResolvers from './resolvers/Application'
import ManagersResolvers from './resolvers/Manager'
import MembersResolvers from './resolvers/Member'
import PayoutsResolvers from './resolvers/Payout'
import PigsCashoutResolvers from './resolvers/Pigs'
import RtsCashoutResolvers from './resolvers/Rts'
import WebsiteCashoutResolvers from './resolvers/Website'
import AuthResolvers from "./resolvers/Auth"
import { GraphQLScalarType } from "graphql";

export default combineResolvers([
	{
		Date: new GraphQLScalarType({
			name: 'Date',
			parseValue(value) {
				return new Date(value)
			},
			serialize(value) {
				return value.toISOString();
			}
		})
	},
	ApplicationsResolvers,
	ManagersResolvers,
	MembersResolvers,
	PayoutsResolvers,
	PigsCashoutResolvers,
	RtsCashoutResolvers,
	WebsiteCashoutResolvers,
	AuthResolvers
])