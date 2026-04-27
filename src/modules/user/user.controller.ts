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
			const meFull: UserPowered = {...me, avatarPath: null}
			if (me.currentAvatarId) {
				const avatar = await UserService.getAvatarById(me.currentAvatarId)
				meFull.avatarPath = avatar
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
            // if (req.bn)
			console.log("why no")
			const u = await UserService.modify( res.locals.userId, req.body, req.file?.filename);
			const meFull: UserPowered = {...u, avatarPath: null}
			if (u.currentAvatarId) {
				const avatar = await UserService.getAvatarById(u.currentAvatarId)
				meFull.avatarPath = avatar
			}
			console.log("OPA")
			console.log(meFull)
			console.log("Im good lol")
			res.status(200).json(meFull);
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
	async getAvatar(req, res, next) {
		try {
			const im = await UserService.getAvatarById(+req.params.id)
            res.status(200).json({avatar: im})
		} catch (error) {
			next(error);
		}
	},
};