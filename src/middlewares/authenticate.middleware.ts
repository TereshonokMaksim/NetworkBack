import { AuthError } from "../errors/standartError";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { ENV } from "../config/env";
import type { Socket } from "socket.io";


type TokenPayload = {
	id: number;
}

export function authenticateSocketMiddleware(
	socket: Socket,
	next: (error?: Error) => void,
) {
	const authorization =
		socket.handshake.auth.token || socket.handshake.headers.token;
	if (!authorization) {
		next(new AuthError("No authorization provided!"));
		return;
	}
	const [type, token] = authorization.split(" ");
	if (type !== "Bearer" || !token) {
		next(new AuthError("Authorization is in wrong format!"));
		return;
	}
	try {
		const userData = verify(token, ENV.JWT_ACCESS_SECRET_KEY);
		if (typeof userData === "string") {
			next(new AuthError("JWT is in wrong format!"));
			return;
		}
		socket.data.userId = (userData as TokenPayload).id;
		next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			next(new AuthError("Token is expired."));
			return;
		}
		if (error instanceof Error) {
			next(error);
		}
		return;
	}
}