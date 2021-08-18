import {errorResponse, successResponse} from '../http/standardResponses'

export default class Entity {
    db
    app
    errorResponse
    successResponse

	constructor(db, app) {
        this.db = db
        this.app = app
        this.errorResponse = errorResponse
        this.successResponse = successResponse
	}
}
