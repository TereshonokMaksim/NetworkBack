import { Prisma } from "../../generated/prisma";

export type User = Prisma.UserGetPayload<{ omit: { password: true } }>;
export type UserModify = Partial<Prisma.UserGetPayload<{omit: {isAdmin: true, createdAt: true, id: true, online: true}}>>
export type UserWithPassword = Prisma.UserGetPayload<{}>;
export type UserCreateInput = Prisma.UserUncheckedCreateInput;

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