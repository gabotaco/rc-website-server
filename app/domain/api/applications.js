import Entity from "../Entity"
import {isInDiscord} from "../discord/inDiscord"

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
}