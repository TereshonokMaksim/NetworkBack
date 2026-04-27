import { Request, Response, NextFunction } from "express";
import type {
    LoginCredentials,
    MeDTO,
    RegisterCredentials,
    User,
    UserCreateInput,
    UserWithPassword,
    UserModify,
    Image,
    Avatar,
    UserPowered
} from "./user.types";
import { AuthenticatedUser } from "../../../types/standartTypes";

export interface UserServiceContract {
    login: (credentials: LoginCredentials) => Promise<{ token: string }>;
    register: (
        credentials: RegisterCredentials
    ) => Promise<{ token: string }>;
    me: (dto: MeDTO) => Promise<User>;
    modify: (userId: number, newData: UserModify, filename?: string) => Promise<User>
    verify: (userId: number, verificationCode: string) => Promise<boolean> 
    getAvatarById: (avatarId: number) => Promise<string>
}
export interface UserRepositoryContract {
    findByEmailWithPassword: (
        email: string,
    ) => Promise<UserWithPassword | null>;
    findByEmail: (email: string) => Promise<User | null>;
    create: (data: UserCreateInput) => Promise<User>;
    findById: (id: number) => Promise<User>;
    modify: (userId: number, newData: UserModify) => Promise<User>;
    createAvatar: (userId: number, imageId: number) => Promise<Avatar>
    createImage: (originalImagePath: string) => Promise<Image>
    getImageById: (imageId: number) => Promise<Image>
    getAvatarById: (avatarId: number) => Promise<Avatar>
}

export interface UserControllerContract {
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
        req: Request<object, UserPowered, object, object, AuthenticatedUser>,
        res: Response<UserPowered, AuthenticatedUser>,
		next: NextFunction
    ) => void;
    modify: (
        req: Request<object, UserPowered, UserModify, object, AuthenticatedUser>,
        res: Response<UserPowered, AuthenticatedUser>,
		next: NextFunction
    ) => void;
    verify: (
        req: Request<object, {success: boolean}, {code: string | number}, object, AuthenticatedUser>,
        res: Response<{success: boolean}, AuthenticatedUser>,
		next: NextFunction
    ) => void;
    getAvatar: (
        req: Request<{id: string}, {avatar: string}, object, AuthenticatedUser>,
        res: Response<{avatar: string}, AuthenticatedUser>,
		next: NextFunction
    ) => void
}