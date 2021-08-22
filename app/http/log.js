import fetch from 'node-fetch'
import AppConfigs from "../configs/app_configs"

export const sendStaffNotfication = (message) => {
    const authOptions = {
        url: AppConfigs.webhook_url,
        form: {
            content: message
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
}