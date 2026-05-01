import { AlbumRepository } from "./album.repository";
import type { AlbumServiceContract } from "./types/album.contracts";


export const AlbumService: AlbumServiceContract = {
    async createAlbum(albumData, userId) {
        return AlbumRepository.createAlbum(albumData.name, albumData.tagId, userId, albumData.year)
    },
    async editAlbum(albumId, newAlbumData) {
        return AlbumRepository.editAlbum(albumId, newAlbumData)
    },
    async getAlbumsByUserId(userId) {
        return AlbumRepository.getAlbumsByUserId(userId)
    },
    async deleteAlbum(albumId) {
        return AlbumRepository.deleteAlbum(albumId)
    },

    async createAlbumImage(originalImagePath, compressedImagePath, albumId) {
        return AlbumRepository.createAlbumImage(originalImagePath, compressedImagePath, albumId)
    },
    async editAlbumImage(imageId, newImageData) {
        return AlbumRepository.editAlbumImage(imageId, newImageData)
    },
    async getAlbumImageByAlbumId(albumId) {
        return AlbumRepository.getAlbumImageByAlbumId(albumId)
    },
    async deleteAlbumImage(imageId) {
        return AlbumRepository.deleteAlbumImage(imageId)
    },

    async getAllTags() {
        return AlbumRepository.getAllTags()
    },
    async getTagById(tagId) {
        return AlbumRepository.getTagById(tagId)
    },
}