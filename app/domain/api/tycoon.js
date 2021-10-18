import Entity from "../Entity"
import sdk from "../../tycoon-sdk/TycoonSDK";
import AppConfigs from "../../configs/app_configs"

export default class Tycoon extends Entity {
    constructor(db, app, api) {
        super(db, app, api)
    }

    getPositions = async (req, res) => {
        const server = req.params.server;

        sdk.Server.getPositions(server).then((response) => {
            this.successResponse(res, response)
        }).catch((err) => {
            this.errorResponse(res, err.message)
        })
    }

    getData = async (req, res) => {
        let uid = req.user.in_game_id;
        if (req.user.ttpermission >= AppConfigs.ttpermissions.SEARCH_OTHERS && req.query.id) {
            uid = req.query.id
        }
        sdk.Player.getData(uid).then((response) => {
            this.successResponse(res, response)   
        }).catch((err) => {
            this.errorResponse(res, err.message)   
        })
    }

    getBiz = async (req, res) => {
        let uid = req.user.in_game_id;
        if (req.user.ttpermission >= AppConfigs.ttpermissions.SEARCH_OTHERS && req.query.id) {
            uid = req.query.id
        }

        sdk.Player.getUserBiz(uid).then((response) => {
            this.successResponse(res, response)   
        }).catch((err) => {
            this.errorResponse(res, err.message)   
        })
    }

    getPlayers = async (req, res) => {
        const server = req.params.server;

        sdk.Server.getPlayers(server).then((response) => {
            this.successResponse(res, response)
        }).catch((err) => {
            this.errorResponse(res, err.message)
        })
    }

    getCharges = async (req, res) => {
        sdk.Utility.getCharges().then((response) => {
            this.successResponse(res, response)
        }).catch((err) => {
            this.errorResponse(res, err.message)
        })
    }
}