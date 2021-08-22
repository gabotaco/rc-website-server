// @flow
import Entity from "../lib/entity"

export default class Data extends Entity {
    constructor(makeApiRequest) {
        super(makeApiRequest)
    }

    snowflake2user = (discord_id) => {
        return this.makeApiRequest({
            uri: `/snowflake2user/${discord_id}`,
            method: 'GET'
        }).then((response) => {
            if (response.user_id) return response.user_id
            return null;
        })
    }

    getCharges = () => {
        return this.makeApiRequest({
            uri: '/charges.json',
            timeout: 2000,
            method: 'GET',
            cache: false
        })
    }
}