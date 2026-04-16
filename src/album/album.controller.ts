import { Request, Response, NextFunction } from 'express';
import * as albumService from './album.service';
import { StandartError } from '../errors/standartError'; 

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const userId = (req as any).user.id; 

        if (!title) {
            throw StandartError.BadReqError('Название альбома обязательно');
        }

        const album = await albumService.createAlbum(userId, title, description);
        return res.json(album);
    } catch (e) {
        next(e);
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const albums = await albumService.getUserAlbums(userId);
        return res.json(albums);
    } catch (e) {
        next(e);
    }
};