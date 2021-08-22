const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
import {sendStaffNotfication} from "../../../http/log"
import Api from "../../../domain/Api"
const api = new Api(null, null)

export const setApplicantContacted = (db, user, id) => {
    const today = new Date()

    return db.applications.findByPk(id).then((result) => {
        if (!result) throw new Error("Unknown applicant")
        result.status = "Contacted";
        result.status_info = db.sequelize.escape(`${user.username}: Awaiting response ${MONTHS[today.getMonth()]} ${today.getDate()}`).slice(1, -1);
        result.save();

        sendStaffNotfication(`<@${user.id}>, the applicants' Discord is: <@${result.discord_id}>`)

        return `${user.username}: ${MONTHS[today.getMonth()]} ${today.getDate()}`
    })
}

export const setApplicantRejected = (db, user, id, reason) => {
    return db.applications.findByPk(id).then((result) => {
        if (!result) throw new Error("Unknown applicant")
        result.status = "Rejected";
        result.status_info = db.sequelize.escape(reason).slice(1, -1);
        result.save();

        sendStaffNotfication(`<@${user.id}> has marked ${result.in_game_name} as **rejected** with reason: **${reason}**`)

        api.Alfred.sendRejectedMessage(result.discord_id, reason)

        return true;
    })
}

export const updateApplicantStatusInfo = (db, user, id, newStatus) => {
    return db.applications.findByPk(id).then((result) => {
        if (!result) throw new Error("Unknown applicant")
        result.status_info = db.sequelize.escape(`${user.username}: ${newStatus}`).slice(1, -1);
        result.save();

        return `${user.username}: ${newStatus}`
    })
}