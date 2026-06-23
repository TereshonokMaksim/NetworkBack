import type { NextFunction, Request, Response } from "express";
import { AuthError } from "../errors/standartError";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { ENV } from "../config/env";
import type { TokenPayload } from "../types/standartTypes";


export function authenticateMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	console.log("Request spotted")
	const authorization = req.headers.authorization;
	if (!authorization) {
		console.log("NO AUTH")
		next(new AuthError("No authorization provided!"));
		return;
	}
	const [type, token] = authorization.split(" ");
	if (type !== "Bearer" || !token) {
		console.log("BAD AUTH")
		next(new AuthError("Authorization is in wrong format!"));
		return;
	}
	try {
		const userData = verify(token, ENV.JWT_ACCESS_SECRET_KEY);
		if (typeof userData === "string") {
			console.log("JWT BAD AUTH")
			next(new AuthError("JWT is in wrong format!"));
			return;
		}
		res.locals.userId = (userData as TokenPayload).id;
		console.log(res.locals.userId, "userId, authentication")
		next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			console.log("OLD AUTH")
			next(new AuthError("Token is expired."));
			return;
		}
		next(error);
	}
}