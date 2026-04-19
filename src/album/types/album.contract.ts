import { Request, Response, NextFunction } from "express";
import type {
    AlbumController,
    AlbumRepository,
    AlbumService
} from "./album.contract";
import { Album, AlbumServiceContract } from "./album.types";
import { AuthenticatedUser } from "../../types/standartTypes";
import { LoginCredentials, RegisterCredentials, RegisterCredentials } from "../../user/types/user.types";

export interface AlbumService {
    createAlbum(userId: number, title: string, description?: string): Promise<any>;
    getUserAlbums(userId: number): Promise<any[]>;
    removeAlbum(albumId: number): Promise<void>;
    createAlbumImage(albumId: number, imageId: number): Promise<void>;
    removeAlbumImage(albumId: number, imageId: number): Promise<void>;
    getAlbumImages(albumId: number): Promise<any[]>;
}

export interface AlbumControllerContract {
    createAlbum(req: any, res: any): Promise<void>;
    getUserAlbums(req: any, res: any): Promise<void>;
    removeAlbum(req: any, res: any): Promise<void>;
    createAlbumImage(req: any, res: any): Promise<void>;
    removeAlbumImage(req: any, res: any): Promise<void>;
    getAlbumImages(req: any, res: any): Promise<void>;
}

export interface AlbumRepositoryContract {
    createAlbum(userId: number, title: string, description?: string): Promise<any>;
    getUserAlbums(userId: number): Promise<any[]>;
    removeAlbum(albumId: number): Promise<void>;
    createAlbumImage(albumId: number, imageId: number): Promise<void>;
    removeAlbumImage(albumId: number, imageId: number): Promise<void>;
    getAlbumImages(albumId: number): Promise<any[]>;
}

export type AlbumModule = {
    service: AlbumServiceContract;
    controller: AlbumControllerContract;
    repository: AlbumRepositoryContract;
}

export interface AlbumControllerContract {
    login: (
        req: Request<object, { token: string }, LoginCredentials>,
        res: Response<{ token: string }>,
        next: NextFunction
    ) => void;
    register: (
        req: Request<object, { token: string }, RegisterCredentials>,
        res: Response<{ token: string }>,
        next: NextFunction
    ) => void;
    me: (
        req: Request<object, Album, object, object, AuthenticatedUser>,
        res: Response<Album, AuthenticatedUser>,
        next: NextFunction
    ) => void;
    modify: (
        req: Request<object, Album, AlbumModify, object, AuthenticatedUser>,
        res: Response<Album , AuthenticatedUser>,
        next: NextFunction
    ) => void;
    verify: (
        req: Request<object, {success: boolean}, {code: string | number}, object, AuthenticatedUser>,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction
    ) => void;
}