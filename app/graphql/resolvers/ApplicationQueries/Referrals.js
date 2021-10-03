import { QueryTypes } from "sequelize"

export const CompletedReferralsType = `
    {
        paid: [ResultObject]!,
        unpaid: [ResultObject]!,
        both: [ResultObject]!,
        moneyOwned: JSON
    }

    type ResultObject {
        in_game_name: String!
        in_game_id: Int!
        discord_id: String!
    }
`

export const getCompletedReferrals = (db) => {
    const response = {
        "paid": [],
        "unpaid": [],
        "both": [],
        "moneyOwned": {}
    }

    return db.sequelize.query(`SELECT applications.paid, re.in_game_name, re.in_game_id, re.discord_id FROM applications, members AS ap, members AS re, pigs, rts WHERE rts.vouchers + pigs.vouchers >= 10000 AND applications.referred_id = re.in_game_id AND applications.in_game_id = ap.in_game_id AND pigs.member_id = ap.id AND rts.member_id = ap.id ORDER BY in_game_id`, {type: QueryTypes.SELECT})
    .then((results) => {
        results.forEach(result => {
            if (result.paid == 0) {
                if (!response.moneyOwned[result.in_game_id]) {
                    response.moneyOwned[result.in_game_id] = {
                        "unpaid": 0,
                        "paid": 0
                    }
                    delete result.paid
                    response.unpaid.push(result)
                    response.both.push(result)
                } else if (response.moneyOwned[result.in_game_id].unpaid == 0) {
                    delete result.paid
                    response.unpaid.push(result)
                }
                response.moneyOwned[result.in_game_id].unpaid += 10000000
            } else {
                if (!response.moneyOwned[result.in_game_id]) {
                    response.moneyOwned[result.in_game_id] = {
                        "unpaid": 0,
                        "paid": 0
                    }
                    delete result.paid
                    response.paid.push(result)
                    response.both.push(result)
                } else if (response.moneyOwned[result.in_game_id].paid == 0) {
                    delete result.paid
                    response.paid.push(result)
                }
                response.moneyOwned[result.in_game_id].paid += 10000000
            }
        });

        return response;
    })
}

export const getReferralDetails = (db, referred_id, paid) => {
    return db.sequelize.query(`SELECT applications.in_game_name, applications.in_game_id, applications.discord_id, pigs.vouchers + rts.vouchers AS total_vouchers FROM applications, members AS ap, members AS re, pigs, rts WHERE rts.vouchers + pigs.vouchers >= 10000 AND applications.referred_id = re.in_game_id AND applications.in_game_id = ap.in_game_id AND pigs.member_id = ap.id AND rts.member_id = ap.id AND applications.referred_id = $referred_id AND applications.paid IN($valid_paid)`, {
        type: QueryTypes.SELECT,
        bind: {
            referred_id: referred_id.toString(),
            valid_paid: paid == 'both' ? ['0', '1'].toString() : [paid].toString()
        }
    })
}

export const markRefAsPaid = (db, referred_id) => {
    return db.sequelize.query(`UPDATE applications, members AS ap, members AS re, pigs, rts SET applications.paid = '1' WHERE pigs.vouchers + rts.vouchers >= 10000 AND applications.referred_id = re.in_game_id AND applications.in_game_id = ap.in_game_id AND pigs.member_id = ap.id AND rts.member_id = ap.id AND applications.referred_id = $referred_id`, {
        type: QueryTypes.UPDATE,
        bind: {
            referred_id: referred_id.toString(),
        }
    }).then((result) => {
        if (result[1] > 0) return true
        return false
    })
}

export const getActiveReferrals = (db) => {
    return db.sequelize.query(`SELECT applications.id AS app_id, ap.in_game_name AS employee_name, ap.in_game_id AS employee_id, pigs.vouchers + rts.vouchers AS total_vouchers, re.in_game_name AS re_name, re.in_game_id AS re_in_game_id, re.discord_id AS re_discord_id FROM applications, members AS ap, members AS re, pigs, rts WHERE applications.paid != '1' AND applications.status = 'Hired' AND ap.company != 'fired' AND rts.vouchers + pigs.vouchers < 10000 AND applications.referred_id = re.in_game_id AND applications.in_game_id = ap.in_game_id AND pigs.member_id = ap.id AND rts.member_id = ap.id`, {
        type: QueryTypes.SELECT
    })
}

export const getAuthUserActiveReferrals = (db, user) => {
    return db.sequelize.query(`SELECT applications.id AS app_id, ap.in_game_name AS employee_name, ap.in_game_id AS employee_id, pigs.vouchers + rts.vouchers AS total_vouchers, re.in_game_name AS re_name, re.in_game_id AS re_in_game_id, re.discord_id AS re_discord_id FROM applications, members AS ap, members AS re, pigs, rts WHERE applications.paid != '1' AND applications.status = 'Hired' AND ap.company != 'fired' AND rts.vouchers + pigs.vouchers < 10000 AND applications.referred_id = re.in_game_id AND applications.in_game_id = ap.in_game_id AND pigs.member_id = ap.id AND rts.member_id = ap.id AND re.in_game_id = $uid`, {
        type: QueryTypes.SELECT,
        bind: {
            uid: user.in_game_id.toString()
        }
    })
}

export const changeRefID = (db, app_id, new_id) => {
    return db.applications.findByPk(app_id).then((app) => {
        app.referred_id = new_id
        app.save()

        return {
            id: app.id,
            referred_id: app.referred_id
        }
    })
}