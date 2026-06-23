import { Prisma } from "../../../generated/prisma";

export type User = {
    name: string | null;
    id: number;
    surname: string | null;
    nickname: string | null;
    username: string | null;
    email: string;
    birthday: string | null;
    online: boolean;
    verified: boolean;
    avatar: string | null | undefined
}
export type UserPowered = {
    name: string | null;
    id: number;
    surname: string | null;
    nickname: string | null;
    username: string | null;
    email: string;
    birthday: string | null;
    online: boolean;
    verified: boolean;
    avatar: string | null | undefined;
}
export type UserModify = {
    name?: string | null | undefined;
    surname?: string | null | undefined;
    nickname?: string | null | undefined;
    username?: string | null | undefined;
    password?: string | undefined;
    email?: string | undefined;
    birthday?: string | null | undefined;
    currentAvatarId?: number | null | undefined;
    showNickname?: boolean | undefined;
    signatureImageId?: number | null | undefined;
    showSignature?: boolean | undefined;
    verified?: boolean | undefined;
}
export type UserWithPassword = {
    name: string | null;
    id: number;
    surname: string | null;
    nickname: string | null;
    username: string | null;
    password: string;
    email: string;
    birthday: string | null;
    online: boolean;
    verified: boolean;
}
export type UserCreateInput = {
    password: string,
    email: string
};

export type UserRep = Prisma.UserGetPayload<{ omit: { password: true } }>;

// DTO - Data Transfer Object
export type LoginCredentials = {
    email: string,
    password: string
}
export type RegisterCredentials = {
    email: string,
    password: string
}
export type MeDTO = {
    userId: number
}

export type ProfileU = {
    id: number
    avatar: string | null | undefined
    isOnline: boolean
    username: string
    pseudonym: string
    postsTotal: number
    readers: number
    friends: number
    status: string
}
export type ProfileRep = Prisma.ProfileGetPayload<{}>

// SOCKETS SPECIFIC PART

export interface SubscribeToStatusUpdatesPayload {
    toUserIds: number[]
}

export interface GetUserStatusesResponse {
    data: {
        userId: number,
        isOnline: boolean
    }[]
}