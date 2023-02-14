import Entity from "../Entity"
import {logPayout} from "../../http/log"

export default class Payout extends Entity {
    generatePin
    payouts
    constructor(db, app, api) {
        super(db, app, api)
        this.payouts = {}

        this.generatePin = () => {
            let num = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

            while (!!this.payouts[num]) {
                num = this.generatePin();
            }

            return num;
        }
    }

    calculate = async (req, res) => {
        if (!req.body.member_id || !parseInt(req.body.vouchers) || !req.body.company) return this.errorResponse(res)
        
        const voucherAmount = parseInt(req.body.vouchers)

        let oldProgress = 0;
        let newProgress = 0;
        let rankVouchers = 1;

        if (req.body.company === 'pigs') {
            var voucherWorth = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 6000) { //Hustler
                    var RankVouchers = 6000
                    var rankWorth = 3500
                } else if (playerTotalVouchers < 18000) { //Pickpocket
                    var RankVouchers = 18000
                    var rankWorth = 4000
                } else if (playerTotalVouchers < 38000) { //Thief
                    var RankVouchers = 38000
                    var rankWorth = 5000
                } else if (playerTotalVouchers < 68000) { //Lawless
                    var RankVouchers = 68000
                    var rankWorth = 6000;
                } else if (playerTotalVouchers < 150000) { //Mastermind
                    var RankVouchers = 150000
                    var rankWorth = 7000
                } else if (playerTotalVouchers < 1500000) { //Overlord
                    var RankVouchers = 1500000
                    var rankWorth = 8500
                } else {
                    var RankVouchers = Infinity
                    var rankWorth = 9000
                }
    
                rankVouchers = RankVouchers;
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const NextRankVouchers = voucherWorth(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    const CurrentRankVouchers = (RankVouchers - playerTotalVouchers) * rankWorth
                    return NextRankVouchers + CurrentRankVouchers
                } else { //don't rank up
                    return voucherAmount * rankWorth
                }
            }
    
            var RankUp = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 6000) { //Hustler
                    var RankVouchers = 6000
                    var nextRank = "Pickpocket"
                } else if (playerTotalVouchers < 18000) { //Pickpocket
                    var RankVouchers = 18000
                    var nextRank = "Thief"
    
                } else if (playerTotalVouchers < 38000) { //Thief
                    var RankVouchers = 38000
                    var nextRank = "Lawless"
                } else if (playerTotalVouchers < 68000) { //Lawless
                    var RankVouchers = 68000
                    var nextRank = "Mastermind";
                } else if (playerTotalVouchers < 150000) { //Mastermind
                    var RankVouchers = 150000
                    var nextRank = "Overlord"
                } else if (playerTotalVouchers < 1500000) { //Overlord
                    var RankVouchers = 1500000
                    var nextRank = "Swine"
                } else {
                    var RankVouchers = Infinity
                    var nextRank = "Max"
                }
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const rankUpAgain = RankUp(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    if (!rankUpAgain) {
                        return nextRank
                    } else {
                        return rankUpAgain
                    }
                } else { //don't rank up
                    return false;
                }
            }
    
            var NewDeadline = function (MemberDetails) { //calculate new deadline
                let CurrentDeadline = new Date(MemberDetails.deadline)
                const D2 = new Date()
                let D3 = D2 - CurrentDeadline //difference between two dates
                if (D3 >= 0) { //if past deadline
                    CurrentDeadline = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    D3 = D2 - CurrentDeadline //difference between two dates
                }
                if (D3 >= -45 * 24 * 60 * 60 * 1000) { //45 days till deadline
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 14) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 250))
    
                        return CurrentDeadline
                    }
                } else { //plenty of time
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 4) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2000))
    
                        return CurrentDeadline
                    }
                }
            }
        } else {
            var voucherWorth = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 9600) { //Initiate
                    var RankVouchers = 9600
                    var rankWorth = 5000
                } else if (playerTotalVouchers < 24000) { //Lead Foot
                    var RankVouchers = 24000
                    var rankWorth = 5500
                } else if (playerTotalVouchers < 52800) { //Wheelman
                    var RankVouchers = 52800
                    var rankWorth = 6000
                } else if (playerTotalVouchers < 117600) { //Legendary
                    var RankVouchers = 117600
                    var rankWorth = 7500;
                } else {
                    var RankVouchers = Infinity
                    var rankWorth = 8500
                }
    
                rankVouchers = RankVouchers
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const NextRankVouchers = voucherWorth(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    const CurrentRankVouchers = (RankVouchers - playerTotalVouchers) * rankWorth
                    return NextRankVouchers + CurrentRankVouchers
                } else { //don't rank up
                    return voucherAmount * rankWorth
                }
            }
    
            var RankUp = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 9600) { //Initiate
                    var RankVouchers = 9600
                    var nextRank = "Lead Foot"
                } else if (playerTotalVouchers < 24000) { //Lead Foot
                    var RankVouchers = 24000
                    var nextRank = "Wheelman"
    
                } else if (playerTotalVouchers < 52800) { //Wheelman
                    var RankVouchers = 52800
                    var nextRank = "Legendary"
                } else if (playerTotalVouchers < 117600) { //Legendary
                    var RankVouchers = 117600
                    var nextRank = "Speed Demon";
                } else {
                    var RankVouchers = Infinity
                    var nextRank = "Max"
                }
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const rankUpAgain = RankUp(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    if (!rankUpAgain) {
                        return nextRank
                    } else {
                        return rankUpAgain
                    }
                } else { //don't rank up
                    return false;
                }
            }
    
            var NewDeadline = function (MemberDetails) {
                let CurrentDeadline = new Date(MemberDetails.deadline)
                const D2 = Date.now()
                let D3 = D2 - CurrentDeadline //difference between two dates
                if (D3 >= 0) { //if past deadline
                    CurrentDeadline = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    D3 = D2 - CurrentDeadline //difference between two dates
                }
                if (D3 >= -45 * 24 * 60 * 60 * 1000) {
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 14) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 250))
    
                        return CurrentDeadline
                    }
                } else {
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 4) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2000))
    
                        return CurrentDeadline
                    }
                }
            }
        }

        this.db.members.findByPk(req.body.member_id, {
            include: [{
                model: this.db.rts,
                as: 'rts'
            }, {
                model: this.db.pigs,
                as: 'pigs'
            }]
        }).then((memberDetails) => {
            if (req.body.company === "pigs") {
                var money = voucherWorth(memberDetails.pigs.vouchers, voucherAmount)
                var DoRank = RankUp(memberDetails.pigs.vouchers, voucherAmount)
                oldProgress = Math.floor((memberDetails.pigs.vouchers / rankVouchers) * 100);
                if (rankVouchers != Infinity) {
                    newProgress = Math.floor(((memberDetails.pigs.vouchers + voucherAmount) / rankVouchers) * 100)
                } else {
                    newProgress = 100;
                }
            } else {
                var money = voucherWorth(memberDetails.rts.vouchers, voucherAmount)
                var DoRank = RankUp(memberDetails.rts.vouchers, voucherAmount)
                oldProgress = Math.floor((memberDetails.rts.vouchers / rankVouchers) * 100);
                if (rankVouchers != Infinity) {
                    newProgress = Math.floor(((memberDetails.rts.vouchers + voucherAmount) / rankVouchers) * 100)
                } else {
                    newProgress = 100;
                }
            }
    
            const newDeadline = NewDeadline(memberDetails).toISOString().split("T")[0]
            
            const pin = this.generatePin()

            this.payouts[pin] = {
                "company": req.body.company,
                "voucherAmount": voucherAmount,
                "money": money,
                "managerID": req.user.manager_id,
                "managerDiscord": req.user.id,
                "memberID": req.body.member_id,
                "deadline": newDeadline,
                "currentDate": new Date().toISOString().split("T")[0],
                "do_rank": DoRank
            }

            this.successResponse(res, {
                "money": money,
                "do_rank": DoRank,
                "pin": pin,
                "oldProgress": oldProgress,
                "newProgress": newProgress
            })
        }).catch(err => {
            console.error(err)
            return this.errorResponse(res, err.message)
        })
    }

    confirm = async (req, res) => {
        if (!req.body.payout_id || !this.payouts[req.body.payout_id]) return this.errorResponse(res);

        const payout = this.payouts[req.body.payout_id];

        this.db.sequelize.transaction(async t => {
            const manager = await this.db.managers.findByPk(payout.managerID, {transaction: t})
            await manager.increment({
                [`${payout.company}_cashout`]: payout.voucherAmount,
                [`${payout.company}_cashout_worth`]: payout.money
            }, {transaction: t});
            
            if (payout.company === 'pigs') {
                var company = await this.db.pigs.findOne({where: {member_id: payout.memberID}, transaction: t})
            } else {
                var company = await this.db.rts.findOne({where: {member_id: payout.memberID}, transaction: t})
            }
            await company.increment({
                'vouchers': payout.voucherAmount,
                'worth': payout.money
            }, {transaction: t});

            await this.db.payout.create({
                manager_id: payout.managerID,
                member_id: payout.memberID,
                company: payout.company,
                amount: payout.voucherAmount,
                worth: payout.money
            }, {transaction: t})

            const member = await this.db.members.findByPk(payout.memberID, {transaction: t});
            member.deadline = this.db.sequelize.escape(payout.deadline).slice(1, -1);
            member.last_turnin = this.db.sequelize.escape(payout.currentDate).slice(1, -1);
            await member.save({transaction: t})

            if (payout.do_rank) {
                const serverID = payout.company == "rts" ? "447157938390433792" : "487285826544205845";
                this.api.Alfred.refreshRoles(member.discord_id, serverID)
            }

            logPayout(payout, member.in_game_name, member.in_game_id, payout.managerDiscord)

            this.successResponse(res)
        })
    }

    getDetails = async (req, res) => {
        if (!parseInt(req.query.vouchers) || !req.query.company) return this.errorResponse(res)
        
        const voucherAmount = parseInt(req.query.vouchers)

        let oldProgress = 0;
        let newProgress = 0;
        let rankVouchers = 1;

        if (req.query.company === 'pigs') {
            var voucherWorth = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 6000) { //Hustler
                    var RankVouchers = 6000
                    var rankWorth = 3500
                } else if (playerTotalVouchers < 18000) { //Pickpocket
                    var RankVouchers = 18000
                    var rankWorth = 4000
                } else if (playerTotalVouchers < 38000) { //Thief
                    var RankVouchers = 38000
                    var rankWorth = 5000
                } else if (playerTotalVouchers < 68000) { //Lawless
                    var RankVouchers = 68000
                    var rankWorth = 6000;
                } else if (playerTotalVouchers < 150000) { //Mastermind
                    var RankVouchers = 150000
                    var rankWorth = 7000
                } else if (playerTotalVouchers < 1500000) { //Overlord
                    var RankVouchers = 1500000
                    var rankWorth = 8500
                } else {
                    var RankVouchers = Infinity
                    var rankWorth = 9000
                }
    
                rankVouchers = RankVouchers;
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const NextRankVouchers = voucherWorth(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    const CurrentRankVouchers = (RankVouchers - playerTotalVouchers) * rankWorth
                    return NextRankVouchers + CurrentRankVouchers
                } else { //don't rank up
                    return voucherAmount * rankWorth
                }
            }
    
            var RankUp = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 6000) { //Hustler
                    var RankVouchers = 6000
                    var nextRank = "Pickpocket"
                } else if (playerTotalVouchers < 18000) { //Pickpocket
                    var RankVouchers = 18000
                    var nextRank = "Thief"
    
                } else if (playerTotalVouchers < 38000) { //Thief
                    var RankVouchers = 38000
                    var nextRank = "Lawless"
                } else if (playerTotalVouchers < 68000) { //Lawless
                    var RankVouchers = 68000
                    var nextRank = "Mastermind";
                } else if (playerTotalVouchers < 150000) { //Mastermind
                    var RankVouchers = 150000
                    var nextRank = "Overlord"
                } else if (playerTotalVouchers < 1500000) { //Overlord
                    var RankVouchers = 1500000
                    var nextRank = "Swine"
                } else {
                    var RankVouchers = Infinity
                    var nextRank = "Max"
                }
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const rankUpAgain = RankUp(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    if (!rankUpAgain) {
                        return nextRank
                    } else {
                        return rankUpAgain
                    }
                } else { //don't rank up
                    return false;
                }
            }
    
            var NewDeadline = function (MemberDetails) { //calculate new deadline
                let CurrentDeadline = new Date(MemberDetails.deadline)
                const D2 = new Date()
                let D3 = D2 - CurrentDeadline //difference between two dates
                if (D3 >= 0) { //if past deadline
                    CurrentDeadline = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    D3 = D2 - CurrentDeadline //difference between two dates
                }
                if (D3 >= -45 * 24 * 60 * 60 * 1000) { //45 days till deadline
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 14) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 250))
    
                        return CurrentDeadline
                    }
                } else { //plenty of time
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 4) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2000))
    
                        return CurrentDeadline
                    }
                }
            }
        } else {
            var voucherWorth = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 9600) { //Initiate
                    var RankVouchers = 9600
                    var rankWorth = 5000
                } else if (playerTotalVouchers < 24000) { //Lead Foot
                    var RankVouchers = 24000
                    var rankWorth = 5500
                } else if (playerTotalVouchers < 52800) { //Wheelman
                    var RankVouchers = 52800
                    var rankWorth = 6000
                } else if (playerTotalVouchers < 117600) { //Legendary
                    var RankVouchers = 117600
                    var rankWorth = 7500;
                } else {
                    var RankVouchers = Infinity
                    var rankWorth = 8500
                }
    
                rankVouchers = RankVouchers
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const NextRankVouchers = voucherWorth(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    const CurrentRankVouchers = (RankVouchers - playerTotalVouchers) * rankWorth
                    return NextRankVouchers + CurrentRankVouchers
                } else { //don't rank up
                    return voucherAmount * rankWorth
                }
            }
    
            var RankUp = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                if (playerTotalVouchers < 9600) { //Initiate
                    var RankVouchers = 9600
                    var nextRank = "Lead Foot"
                } else if (playerTotalVouchers < 24000) { //Lead Foot
                    var RankVouchers = 24000
                    var nextRank = "Wheelman"
    
                } else if (playerTotalVouchers < 52800) { //Wheelman
                    var RankVouchers = 52800
                    var nextRank = "Legendary"
                } else if (playerTotalVouchers < 117600) { //Legendary
                    var RankVouchers = 117600
                    var nextRank = "Speed Demon";
                } else {
                    var RankVouchers = Infinity
                    var nextRank = "Max"
                }
    
                if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                    const rankUpAgain = RankUp(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                    if (!rankUpAgain) {
                        return nextRank
                    } else {
                        return rankUpAgain
                    }
                } else { //don't rank up
                    return false;
                }
            }
    
            var NewDeadline = function (MemberDetails) {
                let CurrentDeadline = new Date(MemberDetails.deadline)
                const D2 = Date.now()
                let D3 = D2 - CurrentDeadline //difference between two dates
                if (D3 >= 0) { //if past deadline
                    CurrentDeadline = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    D3 = D2 - CurrentDeadline //difference between two dates
                }
                if (D3 >= -45 * 24 * 60 * 60 * 1000) {
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 14) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 250))
    
                        return CurrentDeadline
                    }
                } else {
                    if (Math.abs(voucherAmount) > 60000) { //turnin in a lot
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 60000 && Math.abs(voucherAmount) > 30000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 30000 && Math.abs(voucherAmount) >= 15000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                        return CurrentDeadline
                    } else if (Math.abs(voucherAmount) <= 15000 && Math.abs(voucherAmount) >= 6000) {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 4) //add 3 days
                        return CurrentDeadline
                    } else {
                        CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2000))
    
                        return CurrentDeadline
                    }
                }
            }
        }

        this.db.members.findByPk(req.user.member_id, {
            include: [{
                model: this.db.rts,
                as: 'rts'
            }, {
                model: this.db.pigs,
                as: 'pigs'
            }]
        }).then((memberDetails) => {
            if (req.query.company === "pigs") {
                var money = voucherWorth(memberDetails.pigs.vouchers, voucherAmount)
                var DoRank = RankUp(memberDetails.pigs.vouchers, voucherAmount)
                oldProgress = Math.floor((memberDetails.pigs.vouchers / rankVouchers) * 100);
                if (rankVouchers != Infinity) {
                    newProgress = Math.floor(((memberDetails.pigs.vouchers + voucherAmount) / rankVouchers) * 100)
                } else {
                    newProgress = 100;
                }
            } else {
                var money = voucherWorth(memberDetails.rts.vouchers, voucherAmount)
                var DoRank = RankUp(memberDetails.rts.vouchers, voucherAmount)
                oldProgress = Math.floor((memberDetails.rts.vouchers / rankVouchers) * 100);
                if (rankVouchers != Infinity) {
                    newProgress = Math.floor(((memberDetails.rts.vouchers + voucherAmount) / rankVouchers) * 100)
                } else {
                    newProgress = 100;
                }
            }
    
            const newDeadline = NewDeadline(memberDetails).toISOString().split("T")[0]

            this.successResponse(res, {
                "money": money,
                "do_rank": DoRank,
                "oldProgress": oldProgress,
                "newProgress": newProgress,
                "deadline": newDeadline
            })
        }).catch(err => {
            console.error(err)
            return this.errorResponse(res, err.message)
        })
    }
}
