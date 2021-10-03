import { sendStaffNotfication } from "../../../http/log"
import Api from "../../../domain/Api"

export const setManager = (db, uid, active) => {
    return db.members.findByPk(uid).then((member) => {
        return db.managers.findOrCreate({
            where: {member_id: uid}
        }).then(([manager]) => {
            manager.active = active;
            manager.save();

            if (manager.active) {
                sendStaffNotfication(`@everyone <@${member.discord_id}> is now a manager!`)
            } else {
                sendStaffNotfication(`<@${member.discord_id}> is no longer a manager :(`)
            }
            
            return {
                id: uid,
                manager: manager.active
            }
        })
    })
}

export const setCompany = (db, user, uid, company) => {
    const api = new Api(db)

    return db.members.findByPk(uid).then((member) => {
        member.company = company;
        member.save();

        sendStaffNotfication(`<@${user.id}> has changed **(${member.in_game_id}) ${member.in_game_name}**'s company to **${member.company}**`)

        api.Alfred.refreshRoles(member.discord_id, "447157938390433792")
        api.Alfred.refreshRoles(member.discord_id, "487285826544205845")

        return {
            id: uid,
            company: company
        }
    })
}

export const fireMember = (db, user, uid, reason, welcome) => {
    const api = new Api(db)

    return db.members.findByPk(uid).then((member) => {
        member.company = 'fired';
        member.fire_reason = decodeURIComponent(reason)
        member.deadline = new Date().toISOString().split("T")[0]
        member.welcome = welcome
        member.save();

        sendStaffNotfication(`<@${user.id}> has fired **${member.in_game_name}** (**${member.in_game_id}**). <@${member.discord_id}> with reason: **${member.fire_reason}**. They are${!member.welcome ? ' ***NOT*** ' : ' '}welcome back.`)

        api.Alfred.refreshRoles(member.discord_id, "447157938390433792")
        api.Alfred.refreshRoles(member.discord_id, "487285826544205845")

        return {
            id: member.id,
            company: member.company,
            fire_reason: member.fire_reason,
            deadline: member.deadline,
            welcome: member.welcome
        }
    })
}

export const setDeadline = (db, user, uid, deadline) => {
    const api = new Api(db)

    return db.members.findByPk(uid).then((member) => {
        member.deadline = deadline;
        member.save();

        if (new Date(deadline) >= Date.now()) {
            if (member.company == 'rts') var server = "447157938390433792"
            else var server = "487285826544205845"
            
            api.Alfred.refreshRoles(member.discord_id, server)
        }

        sendStaffNotfication(`<@${user.id}> has changed <@${member.discord_id}> (${member.in_game_id}) **${member.in_game_name}**'s deadline to **${new Date(deadline).toDateString()}**`)
        
        return {
            id: member.id,
            deadline: member.deadline
        }
    })
}

export const setWelcome = (db, user, uid, welcome) => {
    return db.members.findByPk(uid).then((member) => {
        member.welcome = welcome;
        member.save();

        sendStaffNotfication(`<@${user.id}> has marked **${member.in_game_name}** (**${member.in_game_id}**) as **${welcome ? "welcome" : "unwelcome"}**!`)
        
        return {
            id: member.id,
            welcome: member.welcome
        }
    })
}