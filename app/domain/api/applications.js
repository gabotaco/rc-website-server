import Entity from "../Entity"
import {isInDiscord} from "../discord/inDiscord"
import { sendStaffNotfication } from "../../http/log"
import { Op } from "sequelize";

export default class Applications extends Entity {
    constructor(db, app, api) {
        super(db, app, api)
    }

    details = async (req, res) => {
        this.db.applications.findByPk(req.params.uid).then((result) => {
            if (!result) return this.errorResponse(res, "No applicant found")

            isInDiscord(result.discord_id, result.company).then((inDiscord) => {
                this.successResponse(res, {...result.toJSON(), in_discord: inDiscord})
            }).catch((err) => {
                console.error(err);
                this.errorResponse(res, err)
            })
        }).catch((err) => {
            console.error(err);
            this.errorResponse(res, err)
        })
    }

    isInDiscord = async (req, res) => {
        if (!req.query.company) {
            return this.errorResponse(res, "Missing required parameter: company");
        }

        isInDiscord(req.user.id, req.query.company).then((inDiscord) => {
            return this.successResponse(res, {in_discord: inDiscord})
        }).catch((err) => { 
            this.errorResponse(res, err.message)
        })
    }

    apply = async (req, res) => {
        if (!req.body.in_game_name || !req.body.in_game_id || (req.body.cooldown === null || req.body.cooldown === undefined) || !req.body.play_per_week || !req.body.company || !req.body.country || !req.body.why || !req.body.anything) {
            sendStaffNotfication(`**FAILED APPLICATION** <@${req.user.id}>`)
            return this.errorResponse(res, {error: "Missing fields in application"});
        }

        req.body.in_game_name = decodeURIComponent(req.body.in_game_name).replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
        req.body.country = decodeURIComponent(req.body.country).replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
        req.body.why = decodeURIComponent(req.body.why).replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
        req.body.anything = decodeURIComponent(req.body.anything).replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
    
        this.db.applications.findOne({where: {discord_id: req.user.id, status: { [Op.ne]: 'Rejected' }}}).then((result) => { 
            if (result) {
                return this.errorResponse(res, {error: "You already have a pending application"});
            }

            this.db.applications.create({discord_id: req.user.id, in_game_name: req.body.in_game_name, in_game_id: req.body.in_game_id, referred_id: req.body.referred_id ? req.body.referred_id : null, cooldown: !req.body.cooldown ? null : req.body.cooldown, play_per_week: req.body.play_per_week, company: req.body.company, country: req.body.country, why: req.body.why, anything: req.body.anything}).then(() => { 
                this.successResponse(res);
                sendStaffNotfication(`**${req.body.in_game_name}** (**${req.body.in_game_id}**) <@${req.body.discord_id}> has just applied to **${req.body.company.toUpperCase()}**!`)
            }).catch((err) => {
                console.error(err)
                this.errorResponse(res, {error: "There was a problem adding your application to the database"})
                sendStaffNotfication(`**FAILED APPLICATION** **${req.body.in_game_id}** <@${req.user.id}>`)
            })

        }).catch(err => {
            console.error(err);
            sendStaffNotfication(`**FAILED APPLICATION** **${req.body.in_game_id}** <@${req.user.id}>`);
        })
    }
}