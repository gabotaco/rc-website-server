import fetch from 'node-fetch'
import {URLSearchParams} from 'url';
import AppConfigs from "../../../configs/app_configs"

export const accessTokenResolver = code => {
    return new Promise((resolve, reject) => {
        const authOptions = {
            url: 'https://discord.com/api/v6/oauth2/token',
            method: 'POST',
            form: {
                client_id: AppConfigs.client_id,
                client_secret: AppConfigs.client_secret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: `${AppConfigs.back_url}/callback`,
                scope: 'identify'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }
        const params = new URLSearchParams(authOptions.form)
        fetch(authOptions.url, {
            headers: authOptions.headers,
            method: authOptions.method,
            body: params
        })
            .then(res => res.json())
            .then(body => {
                if (!body.access_token) throw new Error("No access token in response");
                resolve(body)
            })
            .catch(err => {
                return reject(err)
            })
    })
};
