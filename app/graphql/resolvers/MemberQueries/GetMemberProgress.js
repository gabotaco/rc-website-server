export const MemberProgressType = `
    {
        member: Member!,
        pigs: PigsCashout!,
        rts: RtsCashout!,
        company: MemberCompanyDetails!
    }

    type MemberCompanyDetails {
        pigs_rank: Int!,
        rts_rank: Int!,
        total_members: Int!
    }
`

function sortPigs(a, b) {
    if (a.pigs.vouchers == b.pigs.vouchers) {
        return 0;
    } else {
        return (a.pigs.vouchers > b.pigs.vouchers) ? -1 : 1;
    }
}

function sortRts(a, b) {
    if (a.rts.vouchers == b.rts.vouchers) {
        return 0;
    } else {
        return (a.rts.vouchers > b.rts.vouchers) ? -1 : 1;
    }
}

export const getMemberProgress = (parent, args, {db, user}) => {
    const response = {
        member: {},
        pigs: {},
        rts: {},
        company: {}
    }

    return db.members.findAll({
        include: [{
            model: db.rts,
            as: 'rts'
        }, {
            model: db.pigs,
            as: 'pigs'
        }]
    }).then((result) => {
        const pigsRankArray = result.sort(sortPigs).slice()
        const rtsRankArray = result.sort(sortRts).slice()

        response.company.total_members = result.length;

        for (let i = 0; i < result.length; i++) {
            const member = result[i];
            if (pigsRankArray[i].in_game_id == user.in_game_id) {
                response.company.pigs_rank = i + 1
            }
            if (rtsRankArray[i].in_game_id == user.in_game_id) {
                response.company.rts_rank = i + 1
            }

            if (member.in_game_id == user.in_game_id) {
                response.member = member
                response.rts = member.rts
                response.pigs = member.pigs
            }
        }

        return response;
    })
}