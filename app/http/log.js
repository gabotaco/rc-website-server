import fetch from 'node-fetch'
import AppConfigs from "../configs/app_configs"
const request = require("request")

function formatNumber(num) {
    if (!num) return "0"
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //fancy regex
}

export const sendStaffNotfication = (message) => {
    const authOptions = {
        url: process.env.WEBHOOK_URL,
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
    }).catch(err => {
        return;
    })
}

export const logPayout = (payout, member_name, member_id, manager_discord) => {
    const authOptions = {
        url: process.env.WEBHOOK_URL,
        form: {
            payload_json: JSON.stringify({
                content: payout.voucherAmount < 0 ? "<@404650985529540618>" : "",
                embeds: [{
                    title: "Payout",
                    fields: [{
                            name: "In Game",
                            value: `${member_id} ${member_name}`,
                            inline: true
                        },

                        {
                            name: "Manager",
                            value: `<@${manager_discord}>`,
                            inline: true

                        },
                        {
                            name: "Voucher Amount",
                            value: formatNumber(payout.voucherAmount),
                            inline: true

                        },
                        {
                            name: "Cash Amount",
                            value: "$" + formatNumber(payout.money),
                            inline: true

                        },
                        {
                            name: "New Rank?",
                            value: (payout.do_rank ? payout.do_rank : "No"),
                            inline: true

                        },
                        {
                            name: "Company",
                            value: payout.company.toUpperCase(),
                            inline: true
                        }
                    ]
                }]
            })

        },
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'POST'
    }

    request.post(authOptions, function (err, response, body) {
        
    })
}