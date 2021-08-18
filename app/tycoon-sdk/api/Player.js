// @flow
import Entity from "../lib/entity"

export default class Player extends Entity {
    constructor(makeApiRequest) {
        super(makeApiRequest)
    }

    getUserBiz = (uid) => {
        return this.makeApiRequest({
            uri: `/getuserbiz/${uid}`,
            method: 'GET'
        })
    }

    getOwnedVehicles = (uid) => {
        return this.makeApiRequest({
            uri: `/ownedvehicles/${uid}`,
            method: 'GET'
        })
    }

    getDataBasic = (uid) => {
        return this.makeApiRequest({
            uri: `/data/${uid}`,
            method: 'GET'
        })
    }

    getData = (uid) => {
        return this.makeApiRequest({
            uri: `/dataadv/${uid}`,
            method: 'GET',
        })
    }

    getWealth = (uid) => {
        return this.makeApiRequest({
            uri: `/wealth/${uid}`,
            method: 'GET'
        })
    }

    getStorage = (storageid) => {
        return this.makeApiRequest({
            uri: `/chest/${storageid}`,
            method: 'GET'
        })
    }
}