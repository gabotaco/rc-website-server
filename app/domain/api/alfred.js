import Entity from "../Entity"
import fetch from 'node-fetch'
import child_process from 'child_process'
import AppConfigs from "../../configs/app_configs"

export default class Alfred extends Entity {
    constructor(db, app) {
        super(db, app)
    }

    restart = (req, res) => {
        const authOptions = {
            url: AppConfigs.webhook_url,
            form: {
                content: `<@${req.user.id}> restarted Alfred.`
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST'
        }

        const params = new URLSearchParams(authOptions.form)
        fetch(authOptions.url, {
            headers: authOptions.headers,
            method: authOptions.method,
            body: params
        })
    
        child_process.exec(`pm2 restart Alfred`, function (err, stdout, stderr) {
            if (err) {
                console.error(err)
                this.errorResponse(res, err)
            }
            else {
                this.successResponse(res)
            }
        })
    }
}