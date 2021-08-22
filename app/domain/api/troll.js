import Entity from "../Entity"
import {sendStaffNotfication} from "../../http/log"

export default class Tycoon extends Entity {
    constructor(db, app, api) {
        super(db, app, api)
    }

    hire = async (req, res) => {
        res.redirect(`http://secret.rockwelltransport.com`)

        sendStaffNotfication(`Hey @everyone a big dumb idiot just got rick rolled. Their name is ${req.user.username}#${req.user.discriminator} (<@${req.user.id}>). They wrote "${req.query.in_game_name}" as their name and "${req.query.in_game_id}" as their ID.`)
    }
}