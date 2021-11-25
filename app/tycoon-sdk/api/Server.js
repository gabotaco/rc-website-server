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
            cache: 'OFF',
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
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getAirlineRoutes = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/airline.json',
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getPositions = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/map/positions.json',
            timeout: 2000,
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getPlayersBasic = (server) => {
        return this.makeApiRequest({
            server: server,
            uri: '/players.json',
            method: 'GET',
            cache: 'OFF'
        })
    }

    getPlayers = (server) => {
        if (!server) throw new Error("No server provided")

        return this.makeApiRequest({
            server: server,
            uri: '/widget/players.json',
            method: 'GET',
            timeout: 2000,
            cache: 'OFF'
        })
    }
}