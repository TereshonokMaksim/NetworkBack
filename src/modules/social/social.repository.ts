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
                    id: true,
                },
            });
            const goodUsers: ShortUserInfo[] = [];
            for (let uR of usersRaw) {
                const prof = await PrismaClient.profile.findUniqueOrThrow({where: {userId: uR.id}})
                goodUsers.push({
                    id: uR.id,
                    username: uR.username ? uR.username : "Unnamed",
                    pseudonym: prof.pseudonym ? prof.pseudonym : "Unnamed",
                    avatar: prof.avatar,
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
            const firstIds = await PrismaClient.friendShip.findMany({
                where: { to_user_id: userId, status: "accepted" },
                select: { from_user: true },
            });
            firstIds.forEach((el) => {
                ids.push(el.from_user.id);
            });
            const secondIds = await PrismaClient.friendShip.findMany({
                where: { from_user_id: userId, status: "accepted" },
                select: { to_user: true },
            });
            secondIds.forEach((el) => {
                ids.push(el.to_user.id);
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
            const firstIds = await PrismaClient.friendShip.findMany({
                where: { to_user_id: userId, status: "pending" },
                select: { from_user: true },
            });
            firstIds.forEach((el) => {
                ids.push(el.from_user.id);
            });
            return shuffle(ids);
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getRecomendations(userId, take) {
        try {
            console.log("FORBIDDEN: ", (await PrismaClient.friendShip.findMany({where: {to_user_id: userId}})).map(el => el.id))
            const ids = await PrismaClient.user.findMany({
                // where: { id: { notIn: [...(await this.getRequests(userId)), ...(await this.getFriends(userId)), userId] } },
                where: { 
                    id: {notIn: [userId,
                        ...((await PrismaClient.friendShip.findMany({where: {to_user_id: userId}})).map(el => el.from_user_id)),
                        ...((await PrismaClient.friendShip.findMany({where: {from_user_id: userId}})).map(el => el.to_user_id))
                    ]}
                },
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
            await PrismaClient.friendShip.create({ data: {to_user_id: data.secondUserId, from_user_id: data.firstUserId, status: "accepted"} });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async makeRequest(data) {
        try {
            await PrismaClient.friendShip.create({ data: {to_user_id: data.secondUserId, from_user_id: data.firstUserId, status: "pending"} });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },

    async deleteFriend(userId, friendId) {
        try {
            try {
                await PrismaClient.friendShip.delete({
                    where: { 
                        from_user_id_to_user_id: { 
                            to_user_id: userId, 
                            from_user_id: friendId } 
                        },
                    }
                );
            } catch {   
                try {
                    await PrismaClient.friendShip.delete({
                        where: { 
                            from_user_id_to_user_id: { 
                                to_user_id: friendId, 
                                from_user_id: userId } 
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
            await PrismaClient.friendShip.delete({
                where: { 
                    from_user_id_to_user_id: { 
                        from_user_id: requestId, 
                        to_user_id: userId } 
                    },
                }
            );
        } catch (error) {
            console.log("No request found")
        }
    },
};
