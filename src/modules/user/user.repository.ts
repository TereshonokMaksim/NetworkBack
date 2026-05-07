import { UserRepositoryContract } from "./types/user.contracts";
import type {
	UserWithPassword,
	User,
	UserCreateInput,
} from "./types/user.types";
import { PrismaClient } from "../../prisma/client";
import { InternalServerError } from "../../errors/standartError";
import { HandleDBError } from "../../errors/dbErrorHandler";


export const UserRepository: UserRepositoryContract = {
	async findByEmailWithPassword(
		email: string,
	): Promise<UserWithPassword | null> {
		try {
			return await PrismaClient.user.findFirst({
				where: {
					email: email,
				},
			});
		} catch (error) {
			HandleDBError(error)
			throw new InternalServerError("huh")
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
			HandleDBError(error)
			throw new InternalServerError("huh")
		}
	},
	async create(data: UserCreateInput): Promise<User> {
		try {
            console.log(data, "data")
			return await PrismaClient.user.create({ data });
		} catch (error) {
			HandleDBError(error)
			throw new InternalServerError("huh")
		}
	},
    async modify(userId, newData) {
        try{
            return await PrismaClient.user.update({
                where: { id: userId },
                data: newData,
                omit: {password: true}
            })
		} catch (error) {
			HandleDBError(error)
			throw new InternalServerError("huh")
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
			HandleDBError(error)
			throw new InternalServerError("huh")
		}
	},
	async createImage(originalImagePath) {
		try {
            // Unsure if error handling will work without await
			return await PrismaClient.image.create({
				data: {originalImagePath}
			});
		} catch (error) {
			HandleDBError(error)
			throw new InternalServerError("huh")
		}
	},
	async createAvatar(userId, imageId) {
		try {
            // Unsure if error handling will work without await
			return await PrismaClient.avatar.create({
				data: {userId, imageId}
			});
		} catch (error) {
			HandleDBError(error)
			throw new InternalServerError("huh")
		}
	},
	async getImageById(imageId) {
		try {
            // Unsure if error handling will work without await
			return await PrismaClient.image.findFirstOrThrow({
				where: { id: imageId }
			});
		} catch (error) {
			HandleDBError(error)
			throw new InternalServerError("huh")
		}
	},
	async getAvatarById(avatarId) {
		try {
            // Unsure if error handling will work without await
			return await PrismaClient.avatar.findFirstOrThrow({
				where: { id: avatarId }
			});
		} catch (error) {
			HandleDBError(error)
			throw new InternalServerError("huh")
		}
	},
	
};