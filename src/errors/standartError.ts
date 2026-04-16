export class StandartError extends Error {
    static BadReqError(arg0: string) {
        throw new Error('Method not implemented.');
    }
    public readonly status: number;
    constructor(message: string, status: number){
        super(message)
        this.status = status
    }
}


export class BadReqError extends StandartError {
    constructor(message: string = "Bad request"){
        super(message, 400)
    }
}
export class AuthError extends StandartError{
    constructor(message: string = "Authentication error"){
        super(message, 401)
    }
}
export class ForbiddenError extends StandartError {
    constructor(message: string = "Access denied"){
        super(message, 403)
    }
}
export class NotFoundError extends StandartError {
    constructor(message: string = "Not found"){
        super(message, 404)
    }
}
export class ValidationError extends StandartError {
    constructor(message: string = "Validation error"){
        super(message, 422)
    }
}

export class InternalServerError extends StandartError {
    constructor(message: string = "Internal Server Error"){
        super(message, 500)
    }
}