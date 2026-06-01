import { Request, Response, NextFunction } from "express";
import type {
    LoginCredentials,
    MeDTO,
    RegisterCredentials,
    User,
    UserCreateInput,
    UserWithPassword,
    UserModify,
    UserPowered,
    ProfileU
} from "./user.types";
import { AuthenticatedUser } from "../../../types/standartTypes";

export interface UserServiceContract {
    login: (credentials: LoginCredentials) => Promise<{ token: string }>;
    register: (
        credentials: RegisterCredentials
    ) => Promise<{ token: string }>;
    me: (dto: MeDTO) => Promise<User>;
    modify: (userId: number, newData: UserModify, originalImagePath?: string, compressedImagePath?: string) => Promise<User>
    verify: (userId: number, verificationCode: string) => Promise<boolean> 
    getProfile: (userId: number, myId: number) => Promise<ProfileU>
}
export interface UserRepositoryContract {
    findByEmailWithPassword: (
        email: string,
    ) => Promise<UserWithPassword | null>;
    findByEmail: (email: string) => Promise<User | null>;
    create: (data: UserCreateInput) => Promise<User>;
    findById: (id: number) => Promise<User>;
    modify: (userId: number, newData: UserModify) => Promise<User>;
    createAvatar: (userId: number, image: string) => Promise<void>
    getProfile: (userId: number, myId: number) => Promise<ProfileU>
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
    getProfile: (
        req: Request<{id: string}, ProfileU, object, object, AuthenticatedUser>,
        res: Response<ProfileU, AuthenticatedUser>,
        next: NextFunction
    ) => void
}