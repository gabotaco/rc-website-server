import {accessTokenResolver} from "../auth/resolvers/accessTokenResolver"
import {discordResolver} from "../auth/resolvers/discordResolver"
import {webUserResolver} from "../auth/resolvers/webUserResolver"
import {registerUser} from "../auth/registration/registerUser"
import AppConfigs from "../../configs/app_configs";
import Entity from "../Entity"

export default class Auth extends Entity {
    constructor(db, app, api) {
        super(db, app, api)
    }

    login = async (req, res) => {
        const {code} = req.query;

        try {
            const access = await accessTokenResolver(code).catch((err) => {
                res.redirect(AppConfigs.front_url + "/home")
            });
            if (!access) return;
            const discordUser = await discordResolver(access.access_token);
            const webUser = await webUserResolver(this.db, discordUser.id)
            const companyMember = await this.db.members.findOne({where: {discord_id: discordUser.id}})
            const companyManager = await this.db.managers.findOne({where: {member_id: companyMember.id}})
            const {token, user, expires_in} = registerUser(discordUser, webUser, companyMember, companyManager);
    
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: expires_in * 1000
            })
    
            res.redirect(AppConfigs.front_url + "/home/profile")
        } catch (err) {
            console.error(err)
            this.errorResponse(res, err)
        }
    }

    logout = async (req, res) => {
        res.clearCookie('token')
        return this.successResponse(res)
    }
}