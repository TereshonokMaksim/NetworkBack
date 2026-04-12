import { Request, Response } from "express";
import { StandartError } from "../errors/standartError";

export function errorHandlerMiddleware(
	error: Error,
	req: Request,
	res: Response,
) {
	console.error(error);

	if (error instanceof StandartError) {
		res.status(error.status).json({
			status: "error",
			message: error.message,
		});
		return;
	}

	res.status(500).json({
		status: "error",
		message: "Internal Server Error",
	});
}