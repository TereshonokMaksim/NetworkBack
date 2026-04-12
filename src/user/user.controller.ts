import { Request, Response } from "express";
import { AuthenticatedUser } from "../types/standartTypes";
import { UserControllerContract } from "./types/user.contracts";
import {
	LoginCredentials,
	RegisterCredentials,
	User,
} from "./types/user.types";
import { UserService } from "./user.service";
import { ValidationError } from "../errors/standartError"

export const UserController: UserControllerContract = {
	login: async function (
		req: Request<object, { token: string }, LoginCredentials>,
		res: Response<{ token: string }>,
		next,
	) {
		try {
			const token = await UserService.login(req.body);
			res.status(201).json(token);
		} catch (error) {
			next(error);
		}
	},
	register: async function (
		req: Request<object, { token: string }, RegisterCredentials>,
		res: Response<{ token: string }>,
		next,
	) {
        console.log("Received signal")
		try {
			const token = await UserService.register(
				req.body,
			);
			res.status(201).json(token);
		} catch (error) {
			next(error);
		}
	},
	me: async function (
		req: Request<object, User, object, object, AuthenticatedUser>,
		res: Response<User, AuthenticatedUser>,
		next,
	) {
		try {
			const me = await UserService.me({ userId: res.locals.userId });
			res.status(201).json(me);
		} catch (error) {
			next(error);
		}
	},
	modify: async function (
		req: Request<object, User, object, object, AuthenticatedUser>,
		res: Response<User, AuthenticatedUser>,
		next,
	) {
		try {
            // if (req.bn)
			const u = await UserService.modify( res.locals.userId, req.body);
			res.status(201).json(u);
		} catch (error) {
			next(error);
		}
	},
	verify: async function (
		req,res,next,
	) {
		try {
            // if (req.bn)
            console.log("TRYING TO VERIFY", req.body.code)
			const u = await UserService.verify(res.locals.userId, String(req.body.code))
			res.status(201).json({"success": u});
		} catch (error) {
			next(error);
		}
	},
};