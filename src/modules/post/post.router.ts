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
    "/someone",
    authenticateMiddleware,
    PostController.getSomeonePosts
)
PostRoutes.get(
    "/:pageNumber",
    PostController.getAllPosts
);
PostRoutes.patch(
    "/:id",
    authenticateMiddleware,
    uploadMiddleware.array("media"),
    processImageMiddleware(300, 80, false, false, "post"),
    PostController.editPost
);
PostRoutes.delete(
    "/:id",
    authenticateMiddleware,
    PostController.deletePost
);