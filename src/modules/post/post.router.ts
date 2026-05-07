import { PostController } from "./post.controller";
import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares/auth.middleware";
import { uploadMiddleware, processImageMiddleware } from "../../middlewares/media.middleware";


export const PostRoutes = Router();

PostRoutes.post(
    "/",
    authenticateMiddleware,
    uploadMiddleware.array("media"),
    processImageMiddleware(300, 80, false, false, "post"),
    PostController.createPost
);
PostRoutes.get(
    "/mine",
    authenticateMiddleware,
    PostController.getUserPosts
)
PostRoutes.get(
    "/:pageNumber",
    PostController.getAllPosts
);