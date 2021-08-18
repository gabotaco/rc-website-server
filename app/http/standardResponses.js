
export const errorResponse = (res, body = null) => {
    return res.status(400).send( body === null ? {
        error: "Unable to authenticate user"
    } : body)
}

export const unauthorizedResponse = (res, body = null) => {
    return res.status(401).send(body === null ? { error: "Unable to authenticate user"} : body)
}


export const successResponse = (res, body = null) => {
    return res.status(200).send(body === null ? { status: "success"} : body)
}

export const createdSuccessResponse = (res, body = null) => {
    return res.status(201).send(body === null ? { status: "success"} : body)
}

