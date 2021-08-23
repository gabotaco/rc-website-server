// @flow
import Entity from "../lib/entity"

export default class Server extends Entity {
    cachedPositions;

    constructor(makeApiRequest) {
        super(makeApiRequest)
    }

    isAlive = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/alive',
            method: 'GET',
            cache: false,
            responseType: 'EMPTY'
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
        return this.makeApiRequest({
            server: server,
            uri: '/map/positions.json',
            timeout: 2000,
            method: 'GET'
        })
    }

    getPlayersBasic = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/players.json',
            method: 'GET',
            cache: false
        })
    }

    getPlayers = (server) => {
        if (!server) throw new Error("No server provided")

        return this.makeApiRequest({
            server: server,
            uri: '/widget/players.json',
            method: 'GET',
            timeout: 2000,
            cache: false
        })
    }
}