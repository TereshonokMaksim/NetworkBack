import { Relation, RelationCreate, ShortUserInfo } from "./social.types";
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../../../types/standartTypes";

export type SocialRepositoryContract = {
    getUserShortInfo(userIds: number[]): Promise<ShortUserInfo[]>

    getRequests(userId: number): Promise<number[]>;
    getFriends(userId: number): Promise<number[]>;
    getRecomendations(userId: number, take: number): Promise<number[]>;

    makeRequest(data: RelationCreate): Promise<void>;
    makeFriend(data: RelationCreate): Promise<void>;

    deleteFriend(userId: number, friendId: number): Promise<void>;
    deleteRequest(userId: number, requestId: number): Promise<void>;
};
export type SocialServiceContract = {
    getRequests(userId: number): Promise<ShortUserInfo[]>;
    getFriends(userId: number): Promise<ShortUserInfo[]>;
    getRecomendations(userId: number, take: number): Promise<ShortUserInfo[]>;

    makeRequest(fromUserId: number, toUserId: number): Promise<void>;
    makeFriend(fromUserId: number, toUserId: number): Promise<void>;

    deleteFriend(userId: number, friendId: number): Promise<void>;
    deleteRequest(userId: number, requestId: number): Promise<void>;
};
export type SocialControllerContract = {
    getRequests(
        req: Request<object, ShortUserInfo[], object, object, AuthenticatedUser>,
        res: Response<ShortUserInfo[], AuthenticatedUser>,
        next: NextFunction,
    ): Promise<void>;
    getFriends(
        req: Request<object, ShortUserInfo[], object, object, AuthenticatedUser>,
        res: Response<ShortUserInfo[], AuthenticatedUser>,
        next: NextFunction,
    ): Promise<void>;
    getRecomendations(
        req: Request<object, ShortUserInfo[], object, object, AuthenticatedUser>,
        res: Response<ShortUserInfo[], AuthenticatedUser>,
        next: NextFunction,
    ): Promise<void>;

    makeRequest(
        req: Request<{ toId: string }, {success: boolean}, object, object, AuthenticatedUser>,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction,
    ): Promise<void>;
    makeFriend(
        req: Request<{ toId: string }, {success: boolean}, object, object, AuthenticatedUser>,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction,
    ): Promise<void>;

    deleteFriend(
        req: Request<{ id: string }, {success: boolean}, object, object, AuthenticatedUser>,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction,
    ): Promise<void>;
    deleteRequest(
        req: Request<{ id: string }, {success: boolean}, object, object, AuthenticatedUser>,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction,
    ): Promise<void>;
};
