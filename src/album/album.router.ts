import { Router } from 'express';
import * as albumController from './album.controller';
import { authenticateMiddleware } from '../middlewares/auth.middleware';

export const AlbumRoutes = Router();

AlbumRoutes.post('/', authenticateMiddleware, albumController.create);
AlbumRoutes.get('/', authenticateMiddleware, albumController.getAll);
AlbumRoutes.delete('/:albumId', authenticateMiddleware, albumController.removeAlbum);
AlbumRoutes.post('/:albumId/images', authenticateMiddleware, albumController.createAlbumImage);
AlbumRoutes.delete('/:albumId/images', authenticateMiddleware, albumController.removeAlbumImage);
AlbumRoutes.get('/:albumId/images', authenticateMiddleware, albumController.getAlbumImages);
