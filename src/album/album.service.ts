import { albumRepository } from "../repositories/album.repository";
import { AlbumServiceContract } from "./types/album.contract";

export const AlbumService: AlbumServiceContract = {
    createAlbum(userId: number, title: string, description?: string) {
        return albumRepository.createAlbum(userId, title, description);
    },
    getUserAlbums(userId: number) {
        return albumRepository.getUserAlbums(userId);
    },
    removeAlbum(albumId: number) {
        return albumRepository.removeAlbum(albumId);
    },
    createAlbumImage(albumId: number, imageId: number) {
        return albumRepository.createAlbumImage(albumId, imageId);
    },
    removeAlbumImage(albumId: number, imageId: number) {
        return albumRepository.removeAlbumImage(albumId, imageId);
    },
    getAlbumImages(albumId: number) {
        return albumRepository.getAlbumImages(albumId);
    }
}