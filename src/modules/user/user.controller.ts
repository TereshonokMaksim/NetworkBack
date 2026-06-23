import { Request, Response } from "express";
import { UserControllerContract } from "./types/user.contracts";
import {
	LoginCredentials,
	RegisterCredentials,
	UserPowered,
} from "./types/user.types";
import { UserService } from "./user.service";

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
		req,
		res,
		next,
	) {
		try {
			const me = await UserService.me({ userId: res.locals.userId });
			const meFull: UserPowered = {...me, avatar: null}
			if (me.avatar) {
				meFull.avatar = me.avatar
			}
			res.status(201).json(meFull);
		} catch (error) {
			next(error);
		}
	},
	modify: async function (
		req,
		res,
		next,
	) {
		try {
			const u = await UserService.modify( res.locals.userId, req.body, req.file?.filename);
			const meFull: UserPowered = u
			console.log(meFull)
			res.status(200).json(meFull);
		} catch (error) {
			next(error);
		}
	},
	verify: async function (
		req, res, next,
	) {
		try {
            console.log("TRYING TO VERIFY", req.body.code)
			const u = await UserService.verify(res.locals.userId, String(req.body.code))
			res.status(201).json({"success": u});
		} catch (error) {
			next(error);
		}
	},
	async getProfile(req, res, next) {
		try {
			const id = +req.params.id
            res.status(200).json(await UserService.getProfile(id, res.locals.userId))
		} catch (error) {
			next(error);
		}
	},
};