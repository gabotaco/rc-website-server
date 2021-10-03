import { sendStaffNotfication } from "../../../http/log"

export const changeMemberIdentifiers = (db, user, uid, new_name, new_id, new_discord) => {
    return db.members.findByPk(uid).then((member) => {
        const oldName = member.in_game_name;
        const oldId = member.in_game_id;
        const oldDiscord = member.discord_id;

        member.in_game_name = decodeURIComponent(new_name);
        member.in_game_id = new_id;
        member.discord_id = new_discord;
        member.save();

        sendStaffNotfication(`<@${user.id}> has changed **<@${oldDiscord}> (${oldId}) ${oldName}**'s info. **In Game Name**: ${member.in_game_name !== oldName ? `**${member.in_game_name}**` : member.in_game_name}. **In Game ID**: ${member.in_game_id !== oldId ? `**${member.in_game_id}**` : member.in_game_id}. **Discord ID**: ${member.discord_id !== oldDiscord ? `**${member.discord_id}**` : member.discord_id}`)

        return {
            id: member.id,
            in_game_name: member.in_game_name,
            in_game_id: member.in_game_id,
            discord_id: member.discord_id
        };
    })
}