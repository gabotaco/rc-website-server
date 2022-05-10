// @flow
import Entity from "../lib/entity"

export default class Player extends Entity {
    constructor(makeApiRequest) {
        super(makeApiRequest)
    }

    getUserBiz = (uid) => {
        return this.makeApiRequest({
            uri: `/getuserbiz/${uid}`,
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getUserFaq = (uid) => {
        return this.makeApiRequest({
            uri: `/getuserfaq/${uid}`,
            method: 'GET',
            chache: 'SHORT'
        })
    }

    getOwnedVehicles = (uid) => {
        return this.makeApiRequest({
            uri: `/ownedvehicles/${uid}`,
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getDataBasic = (uid) => {
        return this.makeApiRequest({
            uri: `/data/${uid}`,
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getData = (uid) => {
        return this.makeApiRequest({
            uri: `/dataadv/${uid}`,
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getWealth = (uid) => {
        return this.makeApiRequest({
            uri: `/wealth/${uid}`,
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getStorage = (storageid) => {
        return this.makeApiRequest({
            uri: `/chest/${storageid}`,
            method: 'GET',
            cache: 'LONG'
        })
    }
}