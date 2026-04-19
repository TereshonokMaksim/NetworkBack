import { Request, Response, NextFunction } from 'express';
import * as albumService from './album.service';
import { StandartError } from '../errors/standartError'; 

export const AlbumController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, description } = req.body;
            const userId = (req as any).user.id;
            const album = await albumService.createAlbum(userId, title, description);
            res.status(201).json(album);
        }
        catch (error) {
            next(new StandartError("Failed to create album", 500));
        }
    },
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const albums = await albumService.getUserAlbums(userId);
            res.status(200).json(albums);
        }
        catch (error) {
            next(new StandartError("Failed to fetch albums", 500));
        }
    },
    async removeAlbum(req: Request, res: Response, next: NextFunction) {
        try {
            const albumId = parseInt(req.params.albumId);
            await albumService.removeAlbum(albumId);
            res.status(204).send();
        }
        catch (error) {
            next(new StandartError("Failed to remove album", 500));
        }
    },
    async createAlbumImage(req: Request, res: Response, next: NextFunction) {
        try {
            const albumId = parseInt(req.params.albumId);
            const imageId = parseInt(req.body.imageId);
            await albumService.createAlbumImage(albumId, imageId);
            res.status(201).json({ message: "Image added to album" });
        }
        catch (error) {
            next(new StandartError("Failed to add image to album", 500));
        }
    },
    async removeAlbumImage(req: Request, res: Response, next: NextFunction) {
        try {
            const albumId = parseInt(req.params.albumId);
            const imageId = parseInt(req.body.imageId);
            await albumService.removeAlbumImage(albumId, imageId);
            res.status(204).send();
        }
        catch (error) {
            next(new StandartError("Failed to remove image from album", 500));
        }
    },
    async getAlbumImages(req: Request, res: Response, next: NextFunction) {
        try {
            const albumId = parseInt(req.params.albumId);
            const images = await albumService.getAlbumImages(albumId);
            res.status(200).json(images);
        }
        catch (error) {
            next(new StandartError("Failed to fetch album images", 500));
        }
    },
}