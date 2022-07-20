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
        const that = this;
        sendStaffNotfication(`<@${req.user.id}> restarted Alfred.`)
    
        child_process.exec(`pm2 restart Alfred`, function (err, stdout, stderr) {
            if (err) {
                console.error(err)
                that.errorResponse(res, err)
            }
            else {
                that.successResponse(res)
            }
        })
    }

    sendRejectedMessage = (member, reason) => {
        fetch(`${process.env.ALFRED_URL}/member/message/rejected?access_token=${process.env.ALFRED_ACCESS_TOKEN}&member=${member}&reason=${reason}`, {
            method: 'PATCH'
        }).catch(err => {
            return;
        })
    }

    sendHireMessage = (member, name) => {
        fetch(`${process.env.ALFRED_URL}/member/message/hired?access_token=${process.env.ALFRED_ACCESS_TOKEN}&member=${member}&name=${name}`, {
            method: 'PATCH'
        }).catch(err => {
            return;
        })
    }

    refreshRoles = (member, server) => {
        fetch(`${process.env.ALFRED_URL}/roles/update?access_token=${process.env.ALFRED_ACCESS_TOKEN}&member=${member}&server=${server}`, {
            method: 'PATCH'
        }).catch(err => {
            return;
        })
    }
}