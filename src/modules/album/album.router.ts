import { Router } from "express";
import { AlbumController } from "./album.controller";
import { authenticateMiddleware } from "../../middlewares/auth.middleware";
import { uploadMiddleware, processImageMiddleware } from "../../middlewares/media.middleware";


export const AlbumRoutes = Router();

AlbumRoutes.post("/", authenticateMiddleware, AlbumController.createAlbum)
AlbumRoutes.get("/", authenticateMiddleware, AlbumController.getAllUserAlbums)
AlbumRoutes.patch("/:id", authenticateMiddleware, AlbumController.editAlbum)
AlbumRoutes.delete("/:id", authenticateMiddleware, AlbumController.deleteAlbum)

AlbumRoutes.post(
    "/:albumId/images/", 
    authenticateMiddleware, 
	uploadMiddleware.single("image"),
	processImageMiddleware(200, 70),
    AlbumController.createAlbumImage)
AlbumRoutes.patch("/:albumId/images/:imageId", authenticateMiddleware, AlbumController.editAlbumImage)
AlbumRoutes.get("/:albumId/images", authenticateMiddleware, AlbumController.getAlbumImagesByAlbum)
AlbumRoutes.delete("/:albumId/images/:imageId", authenticateMiddleware, AlbumController.deleteAlbumImage)

AlbumRoutes.get("/tags", AlbumController.getAllTags)
AlbumRoutes.get("/tags/:id", AlbumController.getTagById)
