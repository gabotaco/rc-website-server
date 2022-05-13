import fetch from 'node-fetch'

export const isInDiscord = (id, company) => {
    if (company === "rts") {
        var managerAuthOptions = {
            url: `https://discord.com/api/guilds/447157938390433792/members/${id}`,
            headers: {
                "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                "content-type": "application/json"
            }
        }
    } else {
        var managerAuthOptions = {
            url: `https://discord.com/api/guilds/487285826544205845/members/${id}`,
            headers: {
                "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                "content-type": "application/json"
            }
        }
    }

    return fetch(managerAuthOptions.url, {headers: managerAuthOptions.headers})
        .then(response => {
            if (!response.ok) {
                return false
            }
            return response.json().then((managerBody) => {
                return !!managerBody.joined_at
            })
        })
}