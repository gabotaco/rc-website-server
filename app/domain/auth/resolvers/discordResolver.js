import fetch from 'node-fetch'

export const discordResolver = access_token => {
    return new Promise((resolve, reject) => {
        const authOptions = {
            url: 'https://discord.com/api/users/@me',
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        }

        fetch(authOptions.url, {headers: authOptions.headers})
            .then(res => res.json())
            .then(body => {
                if (body.code == 0) throw new Error(body.message)
                resolve(body)
            })
            .catch(err => {
                return reject(err)
            })
    })
};
