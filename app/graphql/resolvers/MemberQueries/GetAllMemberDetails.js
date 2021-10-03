export const CompanyMemberDetailType = `
    {
        id: Int!
        discord_id: String!
        in_game_name: String!
        in_game_id: Int!
        company: String!
        deadline: Date!
        fire_reason: String
        last_turnin: Date!
        warnings: Int!
        welcome: Boolean!
        updatedAt: Date!
        createdAt: Date!
        pigs: PigsCashout!
        rts: RtsCashout!
        vouchers_turned_in: Int!
        pigs_rank: String!
        rts_rank: String!
        manager: Boolean!
    }
`

function rtsRank(MemberDetails) {
    if (MemberDetails.rts.vouchers < 9600) { //Initiate
        return "Initiate"
    } else if (MemberDetails.rts.vouchers < 24000) { //Lead Foot
        return "Lead Foot"
    } else if (MemberDetails.rts.vouchers < 52800) { //Wheelman
        return "Wheelman"
    } else if (MemberDetails.rts.vouchers < 117600) { //Legendary
        return "Legendary Wheelman"
    } else { //speed demon
        return "Speed Demon"
    }
}

function pigsRank(MemberDetails) {
    if (MemberDetails.pigs.vouchers < 6000) { //Hustler
        return "Hustler"
    } else if (MemberDetails.pigs.vouchers < 18000) { //Pickpocket
        return "Pickpocket"
    } else if (MemberDetails.pigs.vouchers < 38000) { //Thief
        return "Thief"
    } else if (MemberDetails.pigs.vouchers < 68000) { //Lawless
        return "Lawless"
    } else if (MemberDetails.pigs.vouchers < 150000) { //Mastermind
        return "Criminal Mastermind"
    } else {
        return "Overlord"
    }
}

export const getAllMemberDetails = (db) => {
    return db.managers.findAll({
        where: {
            active: true
        }
    }).then((result) => {
        const managerIDs = []
        result.forEach(manager => {
            managerIDs.push(manager.member_id)
        });

        return db.members.findAll({
            include: [{
                model: db.rts,
                as: 'rts'
            }, {
                model: db.pigs,
                as: 'pigs'
            }]
        }).then((result) => {
            for (let i = 0; i < result.length; i++) {
                result[i].vouchers_turned_in = result[i].pigs.vouchers + result[i].rts.vouchers;
                result[i].pigs_rank = pigsRank(result[i])
                result[i].rts_rank = rtsRank(result[i])
                if (managerIDs.includes(result[i].id)) result[i].manager = true
                else result[i].manager = false;
            }

            result.sort(function (x, y) {
                if (x.vouchers_turned_in < y.vouchers_turned_in) {
                    return 1;
                }
                if (x.vouchers_turned_in > y.vouchers_turned_in) {
                    return -1;
                }
                return 0;
            });

            return result;
        })
    })
}