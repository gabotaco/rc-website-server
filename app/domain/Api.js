import Auth from './api/auth'
import Alfred from './api/alfred'
import Tycoon from "./api/tycoon"
import Troll from "./api/troll"
import Benny from "./api/benny"

export default class Api {
    Auth
    Alfred
    Tycoon
    Troll
    Benny
    constructor(db, app) {
        this.Auth = new Auth(db, app)
        this.Alfred = new Alfred(db, app)
        this.Tycoon = new Tycoon(db, app)
        this.Troll = new Troll(db, app)
        this.Benny = new Benny(db, app)
    }
}