import type { AlbumControllerContract } from "./types/album.contracts";
import { AlbumService } from "./album.service";


export const AlbumController: AlbumControllerContract = {
    async createAlbum(req, res, next) {
        try {
            res.status(200).json(await AlbumService.createAlbum(req.body, res.locals.userId))
        } catch (error) {
			next(error);
		}
    },
    async editAlbum(req, res, next) {
        try {
            res.status(200).json(await AlbumService.editAlbum(+req.params.id, req.body))
        } catch (error) {
			next(error);
		}
    },
    async getAllUserAlbums(req, res, next) {
        try {
            res.status(200).json(await AlbumService.getAlbumsByUserId(+res.locals.userId))
        } catch (error) {
			next(error);
		}
    },
    async deleteAlbum(req, res, next) {
        try {
            res.status(200).json({success: true})
        } catch (error) {
			next(error);
		}
    },
    
    async createAlbumImage(req, res, next) {
        try {
            if (!(req.file?.filename)){
                res.status(400).json()
                return
            }
            res.status(200).json(await AlbumService.createAlbumImage(req.file.originalname, req.file.filename, +req.params.albumId))
        } catch (error) {
			next(error);
		}
    },
    async editAlbumImage(req, res, next) {
        try {
            res.status(200).json(await AlbumService.editAlbumImage(+req.params.imageId, req.body))
        } catch (error) {
			next(error);
		}
    },
    async getAlbumImagesByAlbum(req, res, next) {
        try {
            res.status(200).json(await AlbumService.getAlbumImageByAlbumId(+req.params.albumId))
        } catch (error) {
			next(error);
		}
    },
    async deleteAlbumImage(req, res, next) {
        try {
            res.status(200).json(await AlbumService.deleteAlbumImage(+req.params.imageId))
        } catch (error) {
			next(error);
	    }
    }
}