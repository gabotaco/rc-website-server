import Auth from './api/auth'
import Alfred from './api/alfred'
import Tycoon from "./api/tycoon"
import Troll from "./api/troll"
import Benny from "./api/benny"
import Applications from "./api/applications"
import Management from "./api/management"

export default class Api {
    Auth
    Alfred
    Tycoon
    Troll
    Benny
    Applications
    Management
    constructor(db, app) {
        this.Auth = new Auth(db, app, this)
        this.Alfred = new Alfred(db, app, this)
        this.Tycoon = new Tycoon(db, app, this)
        this.Troll = new Troll(db, app, this)
        this.Benny = new Benny(db, app, this)
        this.Applications = new Applications(db, app, this)
        this.Management = new Management(db, app, this)
    }
}