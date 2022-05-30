const { Op } = require("sequelize");
Array.prototype.indexOfId = function (id) {
    for (var i = 0; i < this.length; i++)
        if (this[i].in_game_id === id)
            return i;
    return -1;
}

export const getTopTurnins = (db, num_players, from, to, company) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return db.payout.findAll({
        include: {
            model: db.members,
            as: 'member'
        },
        where: {
            company: company,
            createdAt: {
                [Op.and]: [
                    {[Op.gte]: fromDate.toISOString()},
                    {[Op.lte]: toDate.toISOString()}
                ]
            }
        },
        order: [
            ['member', 'in_game_id', 'DESC']
        ]
    }).then((result) => {
        let TopPlayers = []
        for (let i = 0; i < result.length; i++) {
            const index = TopPlayers.indexOfId(result[i].member.in_game_id)
            if (index > -1) {
                TopPlayers[index].amount += result[i].amount
                TopPlayers[index].worth += result[i].worth
            } else {
                TopPlayers.push(result[i])
            }
        }
        TopPlayers.sort(function (x, y) {
            if (x.amount < y.amount) {
                return 1;
            }
            if (x.amount > y.amount) {
                return -1;
            }
            if (x.worth < y.worth) {
                return 1;
            }
            if (x.worth > y.worth) {
                return -1;
            }
            return 0;
        });

        const response = []
        for (let i = 0; i < num_players && i < TopPlayers.length; i++) {
            response.push({
                "in_game_name": TopPlayers[i].member.in_game_name,
                "in_game_id": TopPlayers[i].member.in_game_id,
                "place": i + 1,
                "vouchers": TopPlayers[i].amount,
                "money": TopPlayers[i].worth
            })
        }
        return response
    })
}
