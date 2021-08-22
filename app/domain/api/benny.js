import Entity from "../Entity"
const authentication = require("../sheets/authentication");
const {
    google
} = require('googleapis');
import AppConfigs from "../../configs/app_configs"

export default class Benny extends Entity {
    constructor(db, app, api) {
        super(db, app, api)
    }

    getList = async (req, res) => {
        authentication.authenticate().then((auth) => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });
            sheets.spreadsheets.values.get({ //gets the search results
                spreadsheetId: AppConfigs.benny_sheet_id,
                range: "Mods List!C3:C500",
            }, (err, response) => {
                if (err) {
                    console.error(err);
                    return this.errorResponse(res, err)
                }
    
                const rows = response.data.values;
                if (!rows) { //if there aren't any values for the data
                    return this.successResponse(res, {"mods": []})
                } else if (rows.length) { //there are rows
                    return this.successResponse(res, rows.map((row) => row[0]))
                }
            })
        })
    }

    search = async (req, res) => {
        const name = req.query.name;

        if (!name) return this.errorResponse(res, "No name provideda")

        authentication.authenticate().then((auth) => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });
            sheets.spreadsheets.values.update({ //Puts what they typed into the search bar
                auth: auth,
                spreadsheetId: AppConfigs.benny_sheet_id,
                range: "Search Engine!D21:G22",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [
                        [name]
                    ]
                }
            }, (err, response) => {
                if (err) {
                    console.error(err);
                    return this.errorResponse(res, err);
                } else { //no error
                    sheets.spreadsheets.values.get({ //gets the search results
                        spreadsheetId: AppConfigs.benny_sheet_id,
                        range: "Search Engine!E26:H35",
                    }, (err, response) => {
                        if (err) {
                            console.error(err)
                            return this.errorResponse(res, err)
                        }
    
                        const rows = response.data.values;
                        if (!rows) { //if there aren't any values for the data
                            return this.successResponse(res, {"cars": []})
                        } else if (rows.length) { //there are rows
                            const cars = []
    
                            rows.map((row) => { //for each row 
                                cars.push({
                                    "name": row[0],
                                    "class": row[1],
                                    "code": row[2],
                                    "author": row[3]
                                })
                            });

                            this.successResponse(res, cars)
                        }
                    })
                }
            });
        })
    }
}