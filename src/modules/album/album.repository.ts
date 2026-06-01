import { AlbumRepositoryContract } from "./types/album.contracts";
import { PrismaClient } from "../../prisma/client";
import { InternalServerError } from "../../errors/standartError";
import { HandleDBError } from "../../errors/dbErrorHandler";
import { AlbumImageForShow } from "./types/album.types";


export const AlbumRepository: AlbumRepositoryContract = {
    async createAlbum(albumName, tagName, userId, year) {
        try {
            const profile = await PrismaClient.profile.findUnique({where: {userId: userId}})
            const album = await PrismaClient.album.create({data: {name: albumName, theme: tagName, profileId: profile!.id, year: year}})
            return {
                id: album.id,
                name: album.name,
                userId: userId,
                shown: album.shown,
                createdAt: album.createdAt,
                previewImageId: -1,
                avatarOnly: false,
                tag: album.theme,
                year: album.year
            }
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async editAlbum(albumId, newData) {
        try {
            const album = await PrismaClient.album.update({where: {id: albumId}, data: newData})
            const user = (await PrismaClient.profile.findUnique({where: {id: album.profileId}, select: {user: true}}))!.user
            return {
                id: album.id,
                name: album.name,
                userId: user.id,
                shown: album.shown,
                createdAt: album.createdAt,
                previewImageId: -1,
                avatarOnly: false,
                tag: album.theme,
                year: album.year
            }
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumById(albumId) {
        try {
            const album = await PrismaClient.album.findUniqueOrThrow({where: {id: albumId}})
            const user = (await PrismaClient.profile.findUnique({where: {id: album.profileId}, select: {user: true}}))!.user
            return {
                id: album.id,
                name: album.name,
                userId: user.id,
                shown: album.shown,
                createdAt: album.createdAt,
                previewImageId: -1,
                avatarOnly: false,
                tag: album.theme,
                year: album.year
            }
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumsByUserId(userId) {
        try {
            const profileId = (await PrismaClient.profile.findUnique({where: {userId}}))!.id
            const albums = await PrismaClient.album.findMany({where: {profileId}, orderBy: {id: "asc"}})
            const newAlbums = albums.map(el => {return {
                id: el.id,
                name: el.name,
                userId: userId,
                shown: el.shown,
                createdAt: el.createdAt,
                previewImageId: -1,
                avatarOnly: false,
                tag: el.theme,
                year: el.year
            }})
            return newAlbums
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async deleteAlbum(albumId) {
        try {
            await PrismaClient.albumImage.deleteMany({where: {albumId}})
            await PrismaClient.album.delete({where: {id: albumId}})
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },

    async createAlbumImage(originalImagePath, compressedImagePath, albumId) {
        try {
            const aim = await PrismaClient.albumImage.create({data: {image: originalImagePath, albumId}})
            return {id: aim.id, albumId: aim.albumId, shown: aim.is_shown, originalImagePath: aim.image}
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async createAlbumImageByImage(image, albumId) {
        try {
            const aim = await PrismaClient.albumImage.create({data: {image, albumId}})
            return {id: aim.id, albumId: aim.albumId, shown: aim.is_shown, image: aim.image}
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumImageByAlbumId(albumId) {
        try {
            const a = await PrismaClient.albumImage.findMany({where: {albumId}})
            const b: AlbumImageForShow[] = []
            a.forEach((el) => {b.push({id: el.id, albumId: el.albumId, originalImagePath: el.image, shown: el.is_shown})})
            return b
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async getAlbumImageById(imageId) {
        try {
            const aim = await PrismaClient.albumImage.findUnique({where: {id: imageId}})
            return {id: aim!.id, albumId: aim!.albumId, shown: aim!.is_shown, image: aim!.image}
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async editAlbumImage(imageId, newData) {
        try {
            const aim = await PrismaClient.albumImage.update({where: {id: imageId}, data: newData})
            return {id: aim!.id, albumId: aim!.albumId, shown: aim!.is_shown, image: aim!.image}
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
    async deleteAlbumImage(imageId) {
        try {
            const aim = await PrismaClient.albumImage.delete({where: {id: imageId}})
            return {id: aim!.id, albumId: aim!.albumId, shown: aim!.is_shown, image: aim!.image}
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },

    async getUserPersonalAlbum(userId) {
        try {
            const prof = await PrismaClient.profile.findUniqueOrThrow({where: {userId}})
            const ma = await PrismaClient.album.findFirstOrThrow({where: {profileId: prof.id, name: "Мої фото"}})
            // const userId = await PrismaClient.profile.findUnique({where: {}})
            return {
                id: ma.id,
                name: ma.name,
                userId: userId,
                shown: ma.shown,
                createdAt: ma.createdAt,
                previewImageId: -1,
                avatarOnly: false,
                tag: ma.theme,
                year: ma.year
            }
        }
        catch (error){
            HandleDBError(error)
            throw new InternalServerError("huh")
        }
    },
}