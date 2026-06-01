import type { SocialControllerContract } from "./types/social.contracts";
import { SocialService } from "./social.service";


export const SocialController: SocialControllerContract = {
    async getFriends(req, res, next) {
        try {
            res.status(200).json(await SocialService.getFriends(res.locals.userId))
        } catch (error) {
            next(error);
        }
    },
    async getRequests(req, res, next) {
        try {
            const data = await SocialService.getRequests(res.locals.userId)
            console.log("data", data)
            res.status(200).json(data)
        } catch (error) {
            next(error);
        }
    },
    async getRecomendations(req, res, next) {
        try {
            res.status(200).json(await SocialService.getRecomendations(res.locals.userId, 10))
        } catch (error) {
            next(error);
        }
    },

    async makeFriend(req, res, next) {
        console.log("Making friend")
        try {
            const id = +req.params.toId
            if (Number.isNaN(id)){
                res.status(422).json({success: false})
                return
            }
            await SocialService.makeFriend(res.locals.userId, id)
            res.status(200).json({success: true})
        } catch (error) {
            next(error);
        }
    },
    async makeRequest(req, res, next) {
        console.log("Making request")
        try {
            const id = +req.params.toId
            if (Number.isNaN(id)){
                res.status(422).json({success: false})
                return
            }
            await SocialService.makeRequest(res.locals.userId, id)
            res.status(200).json({success: true})
        } catch (error) {
            next(error);
        }
    },

    async deleteFriend(req, res, next) {
        try {
            const id = +req.params.id
            if (Number.isNaN(id)){
                res.status(422).json({success: false})
                return
            }
            await SocialService.deleteFriend(res.locals.userId, id)
            res.status(200).json({success: true})
        } catch (error) {
            next(error);
        }
    },
    async deleteRequest(req, res, next) {
        try {
            const id = +req.params.id
            if (Number.isNaN(id)){
                res.status(422).json({success: false})
                return
            }
            await SocialService.deleteFriend(res.locals.userId, id)
            res.status(200).json({success: true})
        } catch (error) {
            next(error);
        }
    },
}