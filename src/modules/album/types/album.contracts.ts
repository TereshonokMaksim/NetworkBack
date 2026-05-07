import type {
    Album,
    AlbumCreate,
    AlbumEdit,
    AlbumImage,
    AlbumImageForShow,
    AlbumImageEdit,
    Image
} from "./album.types";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedUser } from "../../../types/standartTypes";


export type AlbumRepositoryContract = {
    createAlbum: (albumName: string, tagId: number, userId: number, year: number, avatarSpecial?: boolean) => Promise<Album>
    editAlbum: (albumId: number, newData: AlbumEdit) => Promise<Album>
    getAlbumById: (albumId: number) => Promise<Album | null>
    getAlbumsByUserId: (userId: number) => Promise<Album[]>
    deleteAlbum: (albumId: number) => Promise<Album>

    createAlbumImage: (originalImagePath: string, compressedImagePath: string, albumId: number) => Promise<AlbumImageForShow>
    createAlbumImageByImage: (image: Image, albumId: number) => Promise<AlbumImage>
    editAlbumImage: (imageId: number, newData: AlbumImageEdit) => Promise<AlbumImage>
    getAlbumImageById: (imageId: number) => Promise<AlbumImage | null>
    getAlbumImageByAlbumId: (albumId: number) => Promise<AlbumImageForShow[]>
    deleteAlbumImage: (imageId: number) => Promise<AlbumImage>

    getUserPersonalAlbum: (userId: number) => Promise<Album>
}

export type AlbumServiceContract = {
    createAlbum: (albumData: AlbumCreate, userId: number) => Promise<Album>
    editAlbum: (albumId: number, newAlbumData: AlbumEdit) => Promise<Album>
    getAlbumsByUserId: (userId: number) => Promise<Album[]>
    deleteAlbum: (albumId: number) => Promise<Album>
    
    createAlbumImage: (originalImagePath: string, compressedImagePath: string, albumId: number) => Promise<AlbumImageForShow>
    editAlbumImage: (imageId: number, newImageData: AlbumImageEdit) => Promise<AlbumImage>
    getAlbumImageByAlbumId: (albumId: number) => Promise<AlbumImageForShow[]>
    deleteAlbumImage: (imageId: number) => Promise<AlbumImage>
}

export type AlbumControllerContract = {
    createAlbum: (req: Request<object, Album, AlbumCreate, object, AuthenticatedUser>, res: Response<Album, AuthenticatedUser>, next: NextFunction) => Promise<void>
    editAlbum: (req: Request<{id: string}, Album, AlbumEdit, object, AuthenticatedUser>, res: Response<Album, AuthenticatedUser>, next: NextFunction) => Promise<void>
    getAllUserAlbums: (req: Request<object, Album[], object, object, AuthenticatedUser>, res: Response<Album[], AuthenticatedUser>, next: NextFunction) => Promise<void>
    deleteAlbum: (req: Request<{id: string}, Album, object, object, AuthenticatedUser>, res: Response<Album, AuthenticatedUser>, next: NextFunction) => Promise<void>

    createAlbumImage: (req: Request<{albumId: string}, AlbumImageForShow, object, object, AuthenticatedUser>, res: Response<AlbumImageForShow, AuthenticatedUser>, next: NextFunction) => Promise<void>
    editAlbumImage: (req: Request<{albumId: string, imageId: string}, AlbumImage, AlbumImageEdit, object, AuthenticatedUser>, res: Response<AlbumImage, AuthenticatedUser>, next: NextFunction) => Promise<void>
    getAlbumImagesByAlbum: (req: Request<{albumId: string}, AlbumImageForShow[], object, object, AuthenticatedUser>, res: Response<AlbumImageForShow[], AuthenticatedUser>, next: NextFunction) => Promise<void>
    deleteAlbumImage: (req: Request<{albumId: string, imageId: string}, AlbumImage, object, object, AuthenticatedUser>, res: Response<AlbumImage, AuthenticatedUser>, next: NextFunction) => Promise<void>
}