// @flow
import Entity from "../lib/entity"

export default class Server extends Entity {
    cachedPositions;

    constructor(makeApiRequest) {
        super(makeApiRequest)
        this.cachedPositions = {
            "tycoon-w8r4q4.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-2epova.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-2epovd.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-wdrypd.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-njyvop.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-2r4588.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-npl5oy.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-2vzlde.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-wmapod.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            },
            "tycoon-wxjpge.users.cfx.re": {
                "timestamp": 0,
                "response": {
                    "code": "408"
                }
            }
        }
    }

    isAlive = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/alive',
            method: 'GET'
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        })
    }

    getWeather = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/weather.json',
            method: 'GET'
        })
    }

    getAirlineRoutes = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/airline.json',
            method: 'GET'
        })
    }

    getPositions = (server) => {
        if (!this.cachedPositions[server]) throw new Error("Invalid server")

        if (this.cachedPositions[server].timestamp > Date.now() - 4000) {
            return this.cachedPositions[server].response;
        }

        return this.makeApiRequest({
            server: server,
            uri: '/map/positions.json',
            timeout: 2000,
            method: 'GET'
        }).then((response) => {
            this.cachedPositions[server] = {
                timestamp: Date.now(),
                response: response
            }
            return response;
        }).catch((err) => {
            this.cachedPositions[server] = {
                timestamp: Date.now(),
                response: err
            }
            return err;
        })
    }

    getPlayersBasic = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/players.json',
            method: 'GET'
        })
    }

    getPlayers = (server) => {
        if (!server) throw new Error("No server provided")

        return this.makeApiRequest({
            server: server,
            uri: '/widget/players.json',
            method: 'GET',
            timeout: 2000
        })
    }
}