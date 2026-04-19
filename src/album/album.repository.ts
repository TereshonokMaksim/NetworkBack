import { Request, Response } from "express";
import { AlbumService } from "./album.service";
import { AlbumControllerContract } from "./types/album.contract";

export const AlbumController: AlbumControllerContract = {
    async createAlbum(req: Request, res: Response) {
        try {
            const { title, description } = req.body;
            const userId = (req as any).user.id;
            const album = await AlbumService.createAlbum(userId, title, description);
            res.status(201).json(album);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create album" });
        }  
    },
    async getUserAlbums(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const albums = await AlbumService.getUserAlbums(userId);
            res.status(200).json(albums);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch albums" });
        }
    },
    async removeAlbum(req: Request, res: Response) {
        try {
            const albumId = parseInt(req.params.albumId);
            await AlbumService.removeAlbum(albumId);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to remove album" });
        }
    },
    async createAlbumImage(req: Request, res: Response) {
        try {
            const albumId = parseInt(req.params.albumId);
            const imageId = parseInt(req.body.imageId);
            await AlbumService.createAlbumImage(albumId, imageId);
            res.status(201).json({ message: "Image added to album" });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to add image to album" });
        }
    },
    async removeAlbumImage(req: Request, res: Response) {
        try {
            const albumId = parseInt(req.params.albumId);
            const imageId = parseInt(req.body.imageId);
            await AlbumService.removeAlbumImage(albumId, imageId);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to remove image from album" });
        }
    },
    async getAlbumImages(req: Request, res: Response) {
        try {
            const albumId = parseInt(req.params.albumId);
            const images = await AlbumService.getAlbumImages(albumId);
            res.status(200).json(images);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch album images" });
        }
    }
};