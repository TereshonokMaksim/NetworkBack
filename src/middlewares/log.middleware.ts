import { NextFunction, Request, Response } from "express";

export function logMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(`[LOG] Request ${req.method} ${req.path} from ${req.ip}`)
    next()
}