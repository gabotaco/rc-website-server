import Entity from "../Entity"
import fetch from 'node-fetch'
import AppConfigs from "../../configs/app_configs"

export default class Tycoon extends Entity {
    constructor(db, app) {
        super(db, app)
    }

    hire = async (req, res) => {
        res.redirect(`http://secret.rockwelltransport.com`)
        const authOptions = {
            url: AppConfigs.webhook_url,
            form: {
                content: `Hey @everyone a big dumb idiot just got rick rolled. Their name is ${req.user.username}#${req.user.discriminator} (<@${req.user.id}>). They wrote "${req.query.in_game_name}" as their name and "${req.query.in_game_id}" as their ID.`
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            json: true
        }
    
        const params = new URLSearchParams(authOptions.form)
        fetch(authOptions.url, {
            headers: authOptions.headers,
            method: authOptions.method,
            body: params
        })
    }
}