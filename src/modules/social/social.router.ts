import { SocialController } from "./social.controller";
import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares/auth.middleware";
import type { Request, Response } from "express"


export const SocialRoutes = Router();

SocialRoutes.get("/", (req: Request, res: Response) => {res.status(200).json({status: "SOCIAL --- OK", timestamp: Date.now()})})

SocialRoutes.get("/friends", authenticateMiddleware, SocialController.getFriends)
SocialRoutes.get("/recomendations", authenticateMiddleware, SocialController.getRecomendations)
SocialRoutes.get("/requests", authenticateMiddleware, SocialController.getRequests)

SocialRoutes.post("/friends/:toId", authenticateMiddleware, SocialController.makeFriend)
SocialRoutes.post("/requests/:toId", authenticateMiddleware, SocialController.makeRequest)

SocialRoutes.delete("/friends/:id", authenticateMiddleware, SocialController.deleteFriend)
SocialRoutes.delete("/requests/:id", authenticateMiddleware, SocialController.deleteRequest)