import { UserRepositoryContract } from "./types/user.contracts";
import type { UserWithPassword, User, UserCreateInput } from "./types/user.types";
import { PrismaClient } from "../../prisma/client";
import { InternalServerError } from "../../errors/standartError";
import { HandleDBError } from "../../errors/dbErrorHandler";
import { SocialRepository } from "./@x";

export const UserRepository: UserRepositoryContract = {
    async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
        try {
            const user = await PrismaClient.user.findFirst({
                where: {
                    email: email,
                },
            });
            const profile = await PrismaClient.profile.findUnique({
                where: {
                    userId: user!.id
                }
            })
            return {
                name: user!.name,
                id: +user!.id,
                surname: user!.surname,
                nickname: profile!.pseudonym,
                username: user!.username,
                password: user!.password,
                email: user!.email,
                birthday: profile!.birth_date,
                online: true,
                verified: true,
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async findByEmail(email: string): Promise<User | null> {
        try {
            console.log(email, "Trying to get by email")
            const user = await PrismaClient.user.findFirst({
                where: {
                    email: email,
                },
                omit: {
                    password: true,
                },
            });
            console.log("got user", user)
            if (!user){return null}
            console.log("didnt get profile yet")
            const profile = await PrismaClient.profile.findUniqueOrThrow({
                where: {
                    userId: user!.id
                }
            })
            console.log("Profile found!")
            return {
                name: user.name,
                id: user.id,
                username: user.username,
                nickname: profile.pseudonym,
                email: user.email,
                surname: user.surname,
                birthday: profile.birth_date,
                verified: true,
                online: true,
                avatar: profile.avatar
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async create(data: UserCreateInput): Promise<User> {
        try {
            const user = await PrismaClient.user.create({
                data
            });
            const profile = await PrismaClient.profile.create({
                data: {
                    userId: user.id
                }
            })
            console.log(data, "data");
            return {
                name: user.name,
                id: user.id,
                username: user.username,
                nickname: profile.pseudonym,
                email: user.email,
                surname: user.surname,
                birthday: profile.birth_date,
                verified: true,
                online: true,
                avatar: profile.avatar
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async modify(userId, newData) {
        try {
            const {name, surname, username, password, email, verified, showNickname, showSignature, currentAvatarId, signatureImageId, ...d} = newData
            const user = await PrismaClient.user.update({
                where: {id: userId},
                data: {
                    name, surname, username, password, email
                },
                omit: {
                    password: true
                }
            });
            const profile = await PrismaClient.profile.update({
                where: {userId},
                data: {
                    pseudonym: d.nickname,
                    birth_date: d.birthday
                }
            })
            return {
                name: user.name,
                id: user.id,
                username: user.username,
                nickname: profile.pseudonym,
                email: user.email,
                surname: user.surname,
                birthday: profile.birth_date,
                verified: true,
                online: true,
                avatar: profile.avatar
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async findById(id: number) {
        try {
            const user = await PrismaClient.user.findFirstOrThrow({
                where: {
                    id,
                },
                omit: {
                    password: true,
                },
            });
            const profile = await PrismaClient.profile.findUniqueOrThrow({
                where: {
                    userId: user!.id
                }
            })
            return {
                name: user.name,
                id: user.id,
                username: user.username,
                nickname: profile.pseudonym,
                email: user.email,
                surname: user.surname,
                birthday: profile.birth_date,
                verified: true,
                online: true,
                avatar: profile.avatar
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async createAvatar(userId, image) {
        try {
            console.log("Trying to create avatar", userId, image)
            // Unsure if error handling will work without await
            await PrismaClient.profile.update({
                where: {userId},
                data: {avatar: image}
            })
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
                    id: true,
                },
            });
            const prof = await PrismaClient.profile.findUniqueOrThrow({
                where: { userId }
            })
            let status = "none";
            if (!!(await PrismaClient.friendShip.findUnique({
                    where: { from_user_id_to_user_id: { to_user_id: userId, from_user_id: myId }, status: "accepted" },
                })) || !!(await PrismaClient.friendShip.findUnique({
                    where: { from_user_id_to_user_id: { from_user_id: userId, to_user_id: myId }, status: "accepted" },
                }))
            ) {
				status = "friends"
			}
			else if (!!(await PrismaClient.friendShip.findUnique({where: { from_user_id_to_user_id: { from_user_id: userId, to_user_id: myId }, status: "pending" }}))){
				status = "request"
			}
			else if (!!(await PrismaClient.friendShip.findUnique({where: { from_user_id_to_user_id: { from_user_id: myId, to_user_id: userId }, status: "pending" }}))){
				status = "pending"
			}
			return {
				id: uR.id,
				username: uR.username ? uR.username : "Unnamed",
				pseudonym: prof.pseudonym ? prof.pseudonym : "Unnamed",
				avatar: prof.avatar,
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
