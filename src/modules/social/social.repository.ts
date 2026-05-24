import type { SocialRepositoryContract } from "./types/social.contracts";
import { PrismaClient } from "../../prisma/client";
import { InternalServerError } from "../../errors/standartError";
import { HandleDBError } from "../../errors/dbErrorHandler";
import { ShortUserInfo } from "./types/social.types";


function shuffle<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }

  return arr;
}

export const SocialRepository: SocialRepositoryContract = {
    async getUserShortInfo(userIds) {
        try {
            const usersRaw = await PrismaClient.user.findMany({
                where: { id: { in: userIds } },
                select: {
                    username: true,
                    nickname: true,
                    currentAvatar: { select: { image: { select: { compressedImagePath: true } } } },
                    id: true,
                },
            });
            const goodUsers: ShortUserInfo[] = [];
            for (let uR of usersRaw) {
                goodUsers.push({
                    id: uR.id,
                    username: uR.username ? uR.username : "Unnamed",
                    pseudonym: uR.nickname ? uR.nickname : "Unnamed",
                    avatar: uR.currentAvatar?.image.compressedImagePath,
                });
            }
            return goodUsers;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },

    async getFriends(userId) {
        try {
            let ids: number[] = [];
            const firstIds = await PrismaClient.userSocial.findMany({
                where: { firstUserId: userId, status: "friend" },
                select: { secondUserId: true },
            });
            firstIds.forEach((el) => {
                ids.push(el.secondUserId);
            });
            const secondIds = await PrismaClient.userSocial.findMany({
                where: { secondUserId: userId, status: "friend" },
                select: { firstUserId: true },
            });
            secondIds.forEach((el) => {
                ids.push(el.firstUserId);
            });
            return ids;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getRequests(userId) {
        try {
            let ids: number[] = [];
            const firstIds = await PrismaClient.userSocial.findMany({
                where: { secondUserId: userId, status: "request" },
                select: { firstUserId: true },
            });
            firstIds.forEach((el) => {
                ids.push(el.firstUserId);
            });
            return shuffle(ids);
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getRecomendations(userId, take) {
        try {
            const ids = await PrismaClient.user.findMany({
                where: { id: { notIn: [...(await this.getRequests(userId)), ...(await this.getFriends(userId)), userId] } },
                select: { id: true },
                take: take
            });
            const actualIds: number[] = [];
            ids.forEach((el) => {
                actualIds.push(el.id);
            });
            return actualIds;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },

    async makeFriend(data) {
        try {
            await PrismaClient.userSocial.create({ data });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async makeRequest(data) {
        try {
            await PrismaClient.userSocial.create({ data });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },

    async deleteFriend(userId, friendId) {
        try {
            try {
                await PrismaClient.userSocial.delete({
                    where: { 
                        firstUserId_secondUserId: { 
                            firstUserId: userId, 
                            secondUserId: friendId } 
                        },
                    }
                );
            } catch {   
                try {
                    await PrismaClient.userSocial.delete({
                        where: { 
                            firstUserId_secondUserId: { 
                                firstUserId: friendId, 
                                secondUserId: userId } 
                            },
                        }
                    );
                } catch {console.log("No friend found --- DB")}
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async deleteRequest(userId, requestId) {
        try {
            await PrismaClient.userSocial.delete({
                where: { 
                    firstUserId_secondUserId: { 
                        firstUserId: requestId, 
                        secondUserId: userId } 
                    },
                }
            );
        } catch (error) {
            console.log("No request found")
        }
    },
};
