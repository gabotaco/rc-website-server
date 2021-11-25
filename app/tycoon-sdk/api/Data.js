// @flow
import Entity from "../lib/entity"

export default class Data extends Entity {
    constructor(makeApiRequest) {
        super(makeApiRequest)
    }

    getEconomy = () => {
        return this.makeApiRequest({
            uri: '/economy.csv',
            timeout: 2000,
            method: 'GET',
            responseType: 'text',
            cache: 'OFF'
        }).then((response) => {
            const data = [];
            const lines = response.split('\n')
            const keys = lines[0].split(';')

            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split(';')
                const row = {}

                for (let k = 0; k < columns.length; k++) {
                    row[keys[k]] = columns[k]
                }

                data.push(row);
            }

            return data;
        })
    }

    getTop10 = (stat) => {
        return this.makeApiRequest({
            uri: `/top10/${stat}`,
            method: 'GET',
            cache: 'SHORT'
        })
    }

    getConfig = (resource) => {
        return this.makeApiRequest({
            uri: `/config/${resource}`,
            method: 'GET',
            cache: 'OFF'
        })
    }

    getSkillRotation = () => {
        return this.makeApiRequest({
            uri: `/skillrotation.json`,
            method: 'GET',
            cache: 'LONG'
        })
    }
}