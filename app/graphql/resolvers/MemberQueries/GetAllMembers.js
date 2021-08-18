import {Op} from 'sequelize'

export const CompanyMembersType = `
    {
        members: [ListMember]!
        managers: [ListManager]!
        applicants: [ListApplicant]!
    }

    type ListMember {
        in_game_id: Int!
        company: String
        rank: String
    }

    type ListManager {
        in_game_id: Int!
    }

    type ListApplicant {
        in_game_id: Int!
    }
`

export const getAllMembers = (parent, args, {db}) => {
    const response = {
        "members": [],
        "managers": [],
        "applicants": []
    }
    return db.members.findAll({
        include: [{
            model: db.rts,
            as: 'rts'
        }, {
            model: db.pigs,
            as: 'pigs'
        }],
        where: {
            company: { [Op.ne]: 'fired' }
        }
    }).then((result) => {
        for (let i = 0; i < result.length; i++) {
            if (result[i].rts == null || result[i].pigs == null) {
                continue;
            }
            if (result[i].company == "pigs") {
                var currentRank = function (MemberDetails) { //get how much to pay the person
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
                    } else if (MemberDetails.pigs.vouchers < 1500000) { //Overlord
                        return "Overlord"
                    } else {
                        return "Swine"
                    }
                }
            } else {
                var currentRank = function (MemberDetails) {
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
            }
            response.members.push({"in_game_id": result[i].in_game_id, "company": result[i].company, "rank": currentRank(result[i])})
        }

        return db.managers.findAll({
            include: [{
                model: db.members,
                as: 'member'
            }],
            where: {
                active: true
            }
        }).then((result) => {
            for (let i = 0; i < result.length; i++) {
                response.managers.push({"in_game_id": result[i].member.in_game_id})
            }

            return db.applications.findAll({
                where: {
                    [Op.and]: [
                        {
                            status: { [Op.ne]: 'Hired' }
                        },
                        {
                            status: { [Op.ne]: 'Rejected'}
                        }
                    ]
                }
            }).then((result) => {
                for (let i = 0; i < result.length; i++) {
                    response.applicants.push({"in_game_id": result[i].in_game_id})
                }
                return response;
            })
        })
    })
}