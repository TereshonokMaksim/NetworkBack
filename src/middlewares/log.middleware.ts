import { NextFunction, Request, Response } from "express";

export function logMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(`LOG: Request by link ${req.path} from ${req.ip}`)
    next()
}