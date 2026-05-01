import { AlbumRepositoryContract } from "./types/album.contracts";
import { PrismaClient } from "../../prisma/client";
import { InternalServerError } from "../../errors/standartError";
import { HandleDBError } from "../../errors/dbErrorHandler";
import { AlbumImageForShow } from "./types/album.types";


export const AlbumRepository: AlbumRepositoryContract = {
    async createAlbum(albumName, tagId, userId, year, avatarSpecial) {
        try {
            return PrismaClient.album.create({data: {name: albumName, tagId: tagId, userId: userId, year: year, avatarOnly: !!avatarSpecial}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async editAlbum(albumId, newData) {
        try {
            return PrismaClient.album.update({where: {id: albumId}, data: newData})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumById(albumId) {
        try {
            return PrismaClient.album.findUnique({where: {id: albumId}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumsByUserId(userId) {
        try {
            return PrismaClient.album.findMany({where: {userId}, orderBy: {id: "asc"}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async deleteAlbum(albumId) {
        try {
            await PrismaClient.albumImage.deleteMany({where: {albumId}})
            return await PrismaClient.album.delete({where: {id: albumId}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },

    async createAlbumImage(originalImagePath, compressedImagePath, albumId) {
        try {
            const im = await PrismaClient.image.create({data: {originalImagePath: originalImagePath, compressedImagePath}})
            const aim = await PrismaClient.albumImage.create({data: {imageId: im.id, albumId}})
            return {id: aim.id, albumId: aim.albumId, shown: aim.shown, originalImagePath: im.originalImagePath}
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async createAlbumImageByImage(image, albumId) {
        try {
            return PrismaClient.albumImage.create({data: {imageId: image.id, albumId}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumImageByAlbumId(albumId) {
        try {
            const a = await PrismaClient.albumImage.findMany({where: {albumId}, include: {image: {omit: {createdAt: true, id: true, compressedImagePath: true}}}})
            const b: AlbumImageForShow[] = []
            a.forEach((el) => {b.push({id: el.id, albumId: el.albumId, originalImagePath: el.image.originalImagePath, shown: el.shown})})
            return b
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumImageById(imageId) {
        try {
            return PrismaClient.albumImage.findUnique({where: {id: imageId}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async editAlbumImage(imageId, newData) {
        try {
            return PrismaClient.albumImage.update({where: {id: imageId}, data: newData})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async deleteAlbumImage(imageId) {
        try {
            return PrismaClient.albumImage.delete({where: {id: imageId}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },

    getAllTags() {
        try {
            return PrismaClient.tag.findMany()
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getTagById(tagId) {
        try {
            return PrismaClient.tag.findUnique({where: {id: tagId}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },

    async getUserPersonalAlbum(userId) {
        try {
            return PrismaClient.album.findFirstOrThrow({where: {userId, name: "Мої фото"}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
}