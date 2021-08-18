import Sdk from './lib/sdk'
import AppConfigs from '../configs/app_configs'
import Server from "./api/Server"
import Player from "./api/Player"
import Data from "./api/Data"
import Utility from "./api/Utility"

const sdkConfigs = {
    key: AppConfigs.tycoon_key,
    server_order: AppConfigs.server_order
}

class TycoonSDK extends Sdk {
    Server
    Player
    Data
    Utility

    constructor() {
        super(sdkConfigs)

        this.Server = new Server(this.apiCall)
        this.Player = new Player(this.apiCall)
        this.Data = new Data(this.apiCall)
        this.Utility = new Utility(this.apiCall)
    }
}

const instance = new TycoonSDK();

export default instance;
