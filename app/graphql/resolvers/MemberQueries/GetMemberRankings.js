export const RankedMembersType = `
    {
        id: Int!
        discord_id: String!
        in_game_name: String!
        in_game_id: Int!
        company: String!
        last_turnin: Date
        vouchers_turned_in: Int!
        pigs: PigsCashout!
        rts: RtsCashout!
    }
`

export const getMemberRankings = (db, user) => {
    return db.members.findAll({
        include: [{
            model: db.rts,
            as: 'rts'
        }, {
            model: db.pigs,
            as: 'pigs'
        }],
        attributes: ['id', 'discord_id', 'in_game_name', 'in_game_id', 'company', 'last_turnin']
    }).then((result) => {
        const response = []
        for (let i = 0; i < result.length; i++) {
            response.push({
                id: result[i].id,
                discord_id: result[i].discord_id,
                in_game_name: result[i].in_game_name,
                in_game_id: result[i].in_game_id,
                company: result[i].company,
                last_turnin: result[i].id == user.member_id ? result[i].last_turnin : null,
                vouchers_turned_in: result[i].pigs.vouchers + result[i].rts.vouchers,
                pigs: result[i].pigs,
                rts: result[i].rts
            })
        }

        response.sort(function (x, y) {
            if (x.vouchers_turned_in < y.vouchers_turned_in) {
                return 1;
            }
            if (x.vouchers_turned_in > y.vouchers_turned_in) {
                return -1;
            }
            return 0;
        })

        return response;
    })
}