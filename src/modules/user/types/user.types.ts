import { Prisma } from "../../../generated/prisma";

export type User = Prisma.UserGetPayload<{ omit: { password: true } }>;
export type UserPowered = {
    name: string | null;
    id: number;
    surname: string | null;
    nickname: string | null;
    username: string | null;
    email: string;
    birthday: string | null;
    currentAvatarId: number | null;
    showNickname: boolean;
    signatureImageId: number | null;
    showSignature: boolean;
    online: boolean;
    verified: boolean;
    createdAt: Date;
    isAdmin: boolean;
    avatarPath: string | null | undefined;
}
export type UserModify = Partial<Prisma.UserGetPayload<{omit: {isAdmin: true, createdAt: true, id: true, online: true}}>>
export type UserWithPassword = Prisma.UserGetPayload<{}>;
export type UserCreateInput = Prisma.UserUncheckedCreateInput;

export type Image = Prisma.ImageGetPayload<{}>
export type Avatar = Prisma.AvatarGetPayload<{}>

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