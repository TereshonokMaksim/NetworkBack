import { Router } from "express";
import { UserController } from "./user.controller";
// import { validateMiddleware } from "../../middlewares/validate.middleware";
// import { loginSchema, regSchema } from "./user.schema";
// import {
// 	processImageMiddleware,
// 	uploadMiddleware,
// } from "../../middlewares/upload.middleware";
import { authenticateMiddleware } from "../../middlewares/auth.middleware";
import { uploadMiddleware, processImageMiddleware} from "../../middlewares/media.middleware";
import { UserRepository } from "./user.repository";

export const UserRoutes = Router();

UserRoutes.post(
	"/login",
	// validateMiddleware(loginSchema),
	UserController.login,
);
UserRoutes.post(
	"/register",
	// validateMiddleware(regSchema),
	// uploadMiddleware.single("avatar"),
	// processImageMiddleware(200, 80),
	UserController.register,
);
UserRoutes.post(
	"/verify",
    authenticateMiddleware,
	// validateMiddleware(regSchema),
	// uploadMiddleware.single("avatar"),
	// processImageMiddleware(200, 80),
	UserController.verify,
);
UserRoutes.get("/me", authenticateMiddleware, UserController.me);
UserRoutes.patch(
	"/me",
    authenticateMiddleware,
	// validateMiddleware(regSchema),
	uploadMiddleware.single("avatar"),
	processImageMiddleware(200, 80),
	UserController.modify,
	authenticateMiddleware,
    uploadMiddleware.single("signature"),
    processImageMiddleware(400, 200),
    UserRepository.updateSignature,
);
UserRoutes.get(
	"/avatar/:id",
	UserController.getAvatar
)