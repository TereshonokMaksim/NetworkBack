import { HandleDBError } from "../../errors/dbErrorHandler";
import { PrismaClient } from "../../prisma/client";
import { ChatRepositoryContract } from "./types/chat.contracts";

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
                            first_name: true,
                            last_name: true,
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
            });
            const cooked = messages.map(el => {return {
                ...el,
                text: el.text!,
                senderId: el.senderId!,
                sender: {
                    id: el.sender!.id,
                    name: el.sender?.first_name ? el.sender?.first_name : null,
                    surname: el.sender?.last_name ? el.sender?.last_name : null,
                    profile: el.sender!.profile!
                },
            }})
            return cooked
        } catch (error) {
            HandleDBError(error);
            console.error("Unkown error at getAllMessageByChat.");
            throw error;
        }
    },
    async markReadMessages(userId, messages) {
        try {
            for (let msg of messages){
                console.log(`Marking message #${msg.id}`, await PrismaClient.messageReader.findFirst({where: {userId, messageId: msg.id}}))
                if (!(await PrismaClient.messageReader.findFirst({where: {userId, messageId: msg.id}}))){
                    await PrismaClient.messageReader.create({data: {userId, messageId: msg.id}})
                }
            }
        }
        catch (error){
            HandleDBError(error);
            console.error("Unkown error at getAllMessageByChat.");
            throw error;
        }
    },
    async createMessage(data) {
        console.log("CREATING MESSAGE");
        console.log(data);
        try {
            const message = await PrismaClient.message.create({
                data: {
                    text: data.text,
                    chatId: data.chatId,
                    senderId: data.senderId,
                    created_at: new Date()
                },
            });
            await PrismaClient.messageReader.create({data: {userId: data.senderId, messageId: message.id}})
            for (let image of data.messageImages) {
                await PrismaClient.messageImage.create({ data: { image, messageId: message.id } });
            }
            // await PrismaClient.messageImage.createMany({data: data.messageImages.map(el => {return {messageId: message.id, image: el}})})
            return message;
        } catch (error) {
            HandleDBError(error);
            console.error("Unkown error at getAllMessageByChat.");
            throw error;
        }
    },
    async getChat(chatId) {
        try {
            return await PrismaClient.chat.findUnique({ where: { id: chatId } });
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
            return PrismaClient.chat.findUniqueOrThrow({ where: { id: chat.id } });
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
                profile: data.profile!,
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
                            userId
                        }
                    }
                },
                include: {
                    chatUsers: {
                        select: {
                            userId: true
                        }
                    }
                }
            });
            return members
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
                            first_name: true,
                            last_name: true,
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
            if (!el) return el
            return {
                ...el,
                text: el.text!,
                senderId: el.senderId!,
                sender: {
                    id: el.sender!.id,
                    name: el.sender?.first_name ? el.sender?.first_name : null,
                    surname: el.sender?.last_name ? el.sender?.last_name : null,
                    profile: el.sender!.profile!
                },
            }
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
                                userId: userId
                            }
                        }
                    }
                }
            }) 
            return num
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
                        some: {
                            userId
                        }
                    }
                }
            });
            return chats
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
    async createMessageImage(path, messageId) {
        try {
            return await PrismaClient.messageImage.create({ 
                data: { 
                    messageId,
                    image: path
                }
            });
        } catch (error) {
            HandleDBError(error);
            throw error;
        }
    },
};
