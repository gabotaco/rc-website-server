import AppConfigs from "../../../configs/app_configs"
import ownerPerms from "./perms/ownerPerms"
import managerPerms from "./perms/managerPerms"
import exManagerPerms from "./perms/exManagerPerms"
import memberPerms from "./perms/memberPerms"
import guestPerms from "./perms/guestPerms"
import {addUser} from "../index"
import {createUserAccessToken} from "../tokens/createUserAccessToken"

export const registerUser = (discordUser, webUser, companyMember, companyManager) => {
    const user = {
        ...parseDiscord(discordUser),
        ...parseWebUser(webUser),
        ...parseCompanyMember(companyMember, companyManager),
    }
    const {token, expires_in} = createUserAccessToken();

    addUser(token, expires_in, user)

    return {token: token, user: user, expires_in: expires_in};
}

function getAvatar(discordUser) {
    if (discordUser.avatar) {
        return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`
    } else {
        return `https://discord.com/assets/1cbd08c76f8af6dddce02c5138971129.png`
    }
}

function parseDiscord(discordUser) {
    return {
        avatar: getAvatar(discordUser),
        id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator
    }
}

function parseWebUser(webUser) {
    if (webUser) {
        return {
            ttpermission: webUser.permission,
            in_game_id: webUser.in_game_id
        }
    } else {
        return {
            ttpermission: AppConfigs.ttpermissions.UNLINKED
        }
    }
}

function parseCompanyMember(companyMember, companyManager) {
    if (!companyMember) {
        return guestPerms;
    }

    let perms = memberPerms;

    if (companyMember.discord_id == AppConfigs.CEOID || companyMember.discord_id == AppConfigs.CTOID) {
        perms = {...ownerPerms, manager_id: companyManager.id};
    } else if (companyManager) {
        if (companyManager.active) perms = {...managerPerms, manager_id: companyManager.id}
        else perms = {...exManagerPerms, manager_id: companyManager.id}
    }

    return {...perms, member_id: companyMember.id, welcome: companyMember.welcome}
}