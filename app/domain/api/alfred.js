import Entity from "../Entity"
import child_process from 'child_process'
import {sendStaffNotfication} from "../../http/log"
import fetch from 'node-fetch'
import AppConfigs from "../../configs/app_configs"
export default class Alfred extends Entity {
    constructor(db, app, api) {
        super(db, app, api)
    }

    restart = (req, res) => {
        sendStaffNotfication(`<@${req.user.id}> restarted Alfred.`)
    
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

    sendRejectedMessage = (member, reason) => {
        fetch(`${process.env.ALFRED_URL}/member/message/rejected?access_token=${process.env.ALFRED_ACCESS_TOKEN}&member=${member}&reason=${reason}`, {
            method: 'PATCH'
        })
    }

    sendHireMessage = (member, name) => {
        fetch(`${process.env.ALFRED_URL}/member/message/hired?access_token=${process.env.ALFRED_ACCESS_TOKEN}&member=${member}&name=${name}`, {
            method: 'PATCH'
        })
    }

    refreshRoles = (member, server) => {
        fetch(`${process.env.ALFRED_URL}/roles/update?access_token=${process.env.ALFRED_ACCESS_TOKEN}&member=${member}&server=${server}`, {
            method: 'PATCH'
        })
    }
}