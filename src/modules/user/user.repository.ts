import { UserRepositoryContract } from "./types/user.contracts";
import type { UserWithPassword, User, UserCreateInput, Profile } from "./types/user.types";
import { PrismaClient } from "../../prisma/client";
import { InternalServerError } from "../../errors/standartError";
import { HandleDBError } from "../../errors/dbErrorHandler";
import { SocialRepository } from "./@x";

export const UserRepository: UserRepositoryContract = {
    async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
        try {
            return await PrismaClient.user.findFirst({
                where: {
                    email: email,
                },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async findByEmail(email: string): Promise<User | null> {
        try {
            return await PrismaClient.user.findFirst({
                where: {
                    email: email,
                },
                omit: {
                    password: true,
                },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async create(data: UserCreateInput): Promise<User> {
        try {
            console.log(data, "data");
            return await PrismaClient.user.create({ data });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async modify(userId, newData) {
        try {
            return await PrismaClient.user.update({
                where: { id: userId },
                data: newData,
                omit: { password: true },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async findById(id: number): Promise<User> {
        try {
            // Unsure if error handling will work without await
            return await PrismaClient.user.findFirstOrThrow({
                where: { id },
                omit: {
                    password: true,
                },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async createImage(originalImagePath, compressedImagePath) {
        try {
            // Unsure if error handling will work without await
            return await PrismaClient.image.create({
                data: { originalImagePath, compressedImagePath },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async createAvatar(userId, imageId) {
        try {
            // Unsure if error handling will work without await
            return await PrismaClient.avatar.create({
                data: { userId, imageId },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getImageById(imageId) {
        try {
            // Unsure if error handling will work without await
            return await PrismaClient.image.findFirstOrThrow({
                where: { id: imageId },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getAvatarById(avatarId) {
        try {
            // Unsure if error handling will work without await
            return await PrismaClient.avatar.findFirstOrThrow({
                where: { id: avatarId },
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getProfile(userId, myId) {
        try {
            const uR = await PrismaClient.user.findUniqueOrThrow({
                where: { id: userId },
                select: {
                    username: true,
                    nickname: true,
                    currentAvatar: { select: { image: { select: { compressedImagePath: true } } } },
                    id: true,
                },
            });
            let status = "none";
            if (!!(await PrismaClient.userSocial.findUnique({
                    where: { firstUserId_secondUserId: { firstUserId: userId, secondUserId: myId }, status: "friend" },
                })) || !!(await PrismaClient.userSocial.findUnique({
                    where: { firstUserId_secondUserId: { firstUserId: userId, secondUserId: myId }, status: "friend" },
                }))
            ) {
				status = "friends"
			}
			else if (!!(await PrismaClient.userSocial.findUnique({where: { firstUserId_secondUserId: { firstUserId: userId, secondUserId: myId }, status: "request" }}))){
				status = "request"
			}
			else if (!!(await PrismaClient.userSocial.findUnique({where: { firstUserId_secondUserId: { firstUserId: myId, secondUserId: userId }, status: "request" }}))){
				status = "pending"
			}
			return {
				id: uR.id,
				username: uR.username ? uR.username : "Unnamed",
				pseudonym: uR.nickname ? uR.nickname : "Unnamed",
				avatar: uR.currentAvatar?.image.compressedImagePath,
				postsTotal: await PrismaClient.post.count({ where: { authorId: userId } }),
				readers: 0,
				friends: (await SocialRepository.getFriends(userId)).length,
				isOnline: false,
				status,
			};
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
};
