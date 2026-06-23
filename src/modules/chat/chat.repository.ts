import { HandleDBError } from "../../errors/dbErrorHandler";
import { PrismaClient } from "../../prisma/client";
import { ChatRepositoryContract } from "./types/chat.contracts";
import { ChatShortGroup } from "./types/chat.types";

export const ChatRepository: ChatRepositoryContract = {
    async getAllMessagesByChat(chatId, take, page) {
        try {
            const messages = await PrismaClient.message.findMany({
                where: {
                    chatId,
                },
                skip: take * page,
                take: take,
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            profile: {
                                select: {
                                    avatar: true,
                                },
                            },
                        },
                    },
                    messageImages: {
                        select: {
                            id: true,
                            image: true,
                        },
                    },
                    messageReaders: {
                        select: {
                            user: {
                                select: { id: true },
                            },
                        },
                    },
                },
                orderBy: {
                    id: "desc"
                }
            });
            const cooked = messages.toReversed().map((el) => {
                return {
                    ...el,
                    text: el.text!,
                    senderId: el.senderId!,
                    sender: {
                        id: el.sender!.id,
                        username: el.sender?.username ? el.sender.username : "Unnamed",
                        profile: el.sender!.profile!,
                    },
                };
            });
            return cooked;
        } catch (error) {
            HandleDBError(error);
            console.error("Unkown error at getAllMessageByChat.");
            throw error;
        }
    },
    async markReadMessages(userId, messages) {
        try {
            for (let msg of messages) {
                // console.log(
                //     `Marking message #${msg.id}`,
                await PrismaClient.messageReader.findFirst({ where: { userId, messageId: msg.id } })
                // );
                if (!(await PrismaClient.messageReader.findFirst({ where: { userId, messageId: msg.id } }))) {
                    await PrismaClient.messageReader.create({ data: { userId, messageId: msg.id } });
                }
            }
        } catch (error) {
            HandleDBError(error);
            console.error("Unkown error at getAllMessageByChat.");
            throw error;
        }
    },
    async createMessage(data) {
        try {
            let message = await PrismaClient.message.create({
                data: {
                    text: data.text,
                    chatId: data.chatId,
                    senderId: data.senderId,
                    created_at: new Date(),
                },
                include: {
                    sender: {
                        select: {
                            profile: {
                                select: {
                                    avatar: true,
                                },
                            },
                            id: true,
                            username: true
                        },
                    },
                    messageImages: true,
                },
            });
            await PrismaClient.messageReader.create({ data: { userId: data.senderId, messageId: message.id } });
            for (let image of data.messageImages) {
                const objecto = await PrismaClient.messageImage.create({ data: { image, messageId: message.id } });
                message.messageImages.push(objecto);
            }
            // await PrismaClient.messageImage.createMany({data: data.messageImages.map(el => {return {messageId: message.id, image: el}})})
            return {
                ...message,
                text: message.text ? message.text : "",
                senderId: data.senderId!,
                sender: {
                    id: message.sender!.id,
                    username: message.sender!.username!,
                    profile: message.sender!.profile!,
                },
            };
        } catch (error) {
            HandleDBError(error);
            console.error("Unkown error at getAllMessageByChat.");
            throw error;
        }
    },
    async getChat(chatId) {
        try {
            return await PrismaClient.chat.findUnique({ where: { id: chatId }, include: { messages: true } });
        } catch (error) {
            HandleDBError(error);
            console.log("Unkown error at getChat.");
            throw error;
        }
    },
    async createPersonalChat(fromUserId, toUserId) {
        try {
            const chat = await PrismaClient.chat.create({
                data: {
                    is_group: false,
                },
            });
            await PrismaClient.chatUser.create({
                data: {
                    chatId: chat.id,
                    userId: fromUserId,
                },
            });
            await PrismaClient.chatUser.create({
                data: {
                    chatId: chat.id,
                    userId: toUserId,
                },
            });
            return PrismaClient.chat.findUniqueOrThrow({ where: { id: chat.id }, include: { messages: true } });
        } catch (error) {
            HandleDBError(error);
            console.log("Unkown error at createPersonalChat.");
            throw error;
        }
    },
    async getChatWithUsers(userOneId, userTwoId) {
        try {
            const chat = PrismaClient.chat.findFirst({
                where: {
                    is_group: false,
                    chatUsers: {
                        some: {
                            userId: userOneId,
                        },
                    },
                    AND: {
                        chatUsers: {
                            some: {
                                userId: userTwoId,
                            },
                        },
                    },
                },
                include: {
                    messages: true,
                },
            });
            return chat;
        } catch (error) {
            HandleDBError(error);
            console.log("Unkown error at getChatWithUsers.");
            throw error;
        }
    },
    async getShortUserData(userId) {
        try {
            const data = await PrismaClient.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    username: true,
                    profile: {
                        select: {
                            avatar: true,
                        },
                    },
                },
            });
            if (!data) return null;
            if (data.profile === null) {
                throw new Error("NO_PROFILE_CONSTRAINT");
            }
            const n = {
                id: data.id,
                name: data.first_name,
                surname: data.last_name,
                username: data.username!,
                profile: data.profile,
            };
            return n;
        } catch (error) {
            HandleDBError(error);
            console.log("Unkown error at getShortUserData.");
            throw error;
        }
    },
    async getPersonalChats(userId) {
        try {
            // const member = await PrismaClient.chatUser.findUnique({where: {chatId_userId: {chatId: }}})
            const members = await PrismaClient.chat.findMany({
                where: {
                    is_group: false,
                    chatUsers: {
                        some: {
                            userId,
                        },
                    },
                },
                include: {
                    chatUsers: {
                        select: {
                            userId: true,
                        },
                    },
                    messages: {
                        orderBy: {
                            created_at: "desc",
                        },
                    },
                },
            });
            const sorted = members.sort((a, b) => {
                const aTime = a.messages[0]?.created_at?.getTime() ?? 0;
                const bTime = b.messages[0]?.created_at?.getTime() ?? 0;
                return bTime - aTime;
            });
            return members;
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async getChatLastMessage(chatId) {
        try {
            const el = await PrismaClient.message.findFirst({
                where: {
                    chatId,
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            profile: {
                                select: {
                                    avatar: true,
                                },
                            },
                        },
                    },
                    messageImages: {
                        select: {
                            id: true,
                            image: true,
                        },
                    },
                    messageReaders: {
                        select: {
                            user: {
                                select: { id: true },
                            },
                        },
                    },
                },
                orderBy: {
                    id: "desc",
                },
            });
            if (!el) return el;
            return {
                ...el,
                text: el.text!,
                senderId: el.senderId!,
                sender: {
                    id: el.sender!.id,
                    username: el.sender?.username ? el.sender.username : "Unnamed",
                    profile: el.sender!.profile!,
                },
            };
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async getUnreadMessages(chatId, userId) {
        try {
            const num: number = await PrismaClient.message.count({
                where: {
                    chatId: chatId,
                    NOT: {
                        messageReaders: {
                            some: {
                                userId: userId,
                            },
                        },
                    },
                },
            });
            return num;
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async getGroupChats(userId) {
        try {
            const chats = await PrismaClient.chat.findMany({
                where: {
                    is_group: true,
                    chatUsers: {
                        some: { userId },
                    },
                },
                include: {
                    messages: {
                        orderBy: {
                            created_at: "desc",
                        },
                        take: 1,
                    },
                },
            });
            const sorted = chats.sort((a, b) => {
                const aTime = a.messages[0]?.created_at?.getTime() ?? 0;
                const bTime = b.messages[0]?.created_at?.getTime() ?? 0;
                return bTime - aTime;
            });
            const cookedChats: ChatShortGroup[] = [];
            for (let chat of sorted) {
                const el = chat;
                cookedChats.push({
                    id: el.id,
                    name: el.name!,
                    currentlyOnline: 1,
                    lastMessage: await this.getChatLastMessage(el.id),
                    avatar: el.avatar,
                    peopleOnline: [userId],
                    userIsAdmin: el.adminId === userId,
                    messagesUnread: await this.getUnreadMessages(el.id, userId),
                });
            }
            return cookedChats;
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async createGroupChat(dto) {
        try {
            const chat = await PrismaClient.chat.create({
                data: {
                    adminId: dto.creatorId,
                    name: dto.name,
                    is_group: true,
                    avatar: dto.avatarPath,
                },
            });
            for (let member of [...dto.members, dto.creatorId]) {
                await PrismaClient.chatUser.create({ data: { chatId: chat.id, userId: member } });
            }
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async editGroupChat(chatId, dto) {
        try {
            const chat = await PrismaClient.chat.update({
                where: { id: chatId },
                data: {
                    adminId: dto.creatorId,
                    name: dto.name,
                    is_group: true,
                    avatar: dto.avatarPath,
                },
            });
            await PrismaClient.chatUser.deleteMany({ where: { chatId } });
            for (let member of [...dto.members, dto.creatorId]) {
                await PrismaClient.chatUser.create({ data: { chatId: chat.id, userId: member } });
            }
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async getChatMemberNumber(chatId) {
        try {
            return await PrismaClient.chatUser.count({ where: { chatId } });
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async deleteChat(chatId) {
        try {
            await PrismaClient.messageImage.deleteMany({ where: { message: { chatId } } });
            await PrismaClient.messageReader.deleteMany({ where: { message: { chatId } } });
            await PrismaClient.message.deleteMany({ where: { chatId } });
            await PrismaClient.chatUser.deleteMany({ where: { chatId } });
            await PrismaClient.chat.delete({ where: { id: chatId } });
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async getChatMemberIds(chatId) {
        try {
            const chatUsers = await PrismaClient.chatUser.findMany({ where: { chatId }, select: { userId: true } });
            const cooked = chatUsers.map((el) => el.userId);
            return cooked;
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async isGroupChat(chatId) {
        try {
            const chat = await PrismaClient.chat.findUnique({
                where: { id: chatId, is_group: true },
                select: { id: true },
            });
            return !!chat;
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
};
