import { ChatRepository } from "./chat.repository";
import { ChatServiceContract } from "./types/chat.contracts";
import { UserRepository } from "./@x";
import { ChatShort, MessageImage, UnreadMessagesInfo } from "./types/chat.types";
import { User } from "../user/types/user.types";
import { NotFoundError } from "../../errors/standartError";

export const ChatService: ChatServiceContract = {
    async getAllMessagesByChat(userId, chatId, take, page) {
        const messages = await ChatRepository.getAllMessagesByChat(chatId, take, page);
        ChatRepository.markReadMessages(userId, messages);
        return messages;
    },
    async sendMessage(dto) {
        return await ChatRepository.createMessage(dto);
    },
    async getChatInfo(chatId, userId) {
        const chat = await ChatRepository.getChat(chatId);
        if (!chat) return null;
        const messages = await ChatRepository.getAllMessagesByChat(chatId, 20, 0);
        return {
            id: chat.id,
            name: chat.name,
            avatar: chat.avatar,
            isGroup: chat.is_group,
            userIsAdmin: chat.adminId === userId,
            messages: messages,
            peopleOnline: [],
            totalMembers: 2,
            memberIds: await ChatRepository.getChatMemberIds(chat.id),
        };
    },
    async getPersonalChat(userId, clientId) {
        const userData = await UserRepository.findById(userId);
        const chat = await ChatRepository.getChatWithUsers(userId, clientId);
        if (chat) {
            const messa = await ChatRepository.getAllMessagesByChat(chat.id, 100, 0);
            ChatRepository.markReadMessages(clientId, messa);
            return {
                id: chat.id,
                name: userData.username,
                avatar: userData.avatar,
                isGroup: false,
                userIsAdmin: false,
                messages: messa,
                peopleOnline: [],
                totalMembers: 2,
                memberIds: [],
            };
        }
        const newChat = await ChatRepository.createPersonalChat(clientId, userId);
        return {
            id: newChat.id,
            name: userData.username,
            avatar: userData.avatar,
            isGroup: false,
            userIsAdmin: false,
            messages: [],
            peopleOnline: [],
            totalMembers: 2,
            memberIds: [],
        };
    },
    async getGroupChat(userId, chatId) {
        const chat = await ChatRepository.getChat(chatId)!;
        if (!chat) {
            throw new NotFoundError("NO_CHAT");
        }
        const messa = await ChatRepository.getAllMessagesByChat(chat.id, 100, 0);
        ChatRepository.markReadMessages(userId, messa);
        ChatRepository.markReadMessages(1, messa);
        return {
            id: chat.id,
            name: chat.name,
            avatar: chat.avatar,
            isGroup: true,
            userIsAdmin: chat.adminId === userId,
            messages: await ChatRepository.getAllMessagesByChat(chat.id, 20, 0),
            peopleOnline: [userId],
            totalMembers: await ChatRepository.getChatMemberNumber(chat.id),
            memberIds: await ChatRepository.getChatMemberIds(chat.id),
        };
    },
    async getPersonalChats(userId) {
        const chats = await ChatRepository.getPersonalChats(userId);
        const cookedChats: ChatShort[] = [];
        for (let chat of chats) {
            let userData: User;
            if (userId === chat.chatUsers[0]!.userId) {
                userData = await UserRepository.findById(chat.chatUsers[1]!.userId);
            } else {
                userData = await UserRepository.findById(chat.chatUsers[0]!.userId);
            }
            cookedChats.push({
                id: chat.id,
                userIsAdmin: userId === chat.adminId,
                avatar: userData.avatar,
                isGroup: false,
                lastMessage: await ChatRepository.getChatLastMessage(chat.id),
                name: userData.username,
                isOnline: false,
                peopleOnline: [],
                userId: userData.id,
                messagesUnread: await ChatRepository.getUnreadMessages(chat.id, userId),
            });
        }
        return cookedChats;
    },
    async markReadMessage(userId, messageId) {
        await ChatRepository.markReadMessages(userId, [{ id: messageId }]);
    },
    async getUnreadData(userId) {
        const data: UnreadMessagesInfo = {
            unreadGroupChats: 0,
            unreadPersonalChats: 0,
        };
        const groups = await ChatRepository.getGroupChats(userId);
        const personal = await ChatRepository.getPersonalChats(userId);
        for (let gr of groups) {
            data.unreadGroupChats += await ChatRepository.getUnreadMessages(gr.id, userId);
        }
        for (let pers of personal) {
            data.unreadPersonalChats += await ChatRepository.getUnreadMessages(pers.id, userId);
        }
        return data;
    },
    async sendMessageWithImages(dto) {
        const message = await ChatRepository.createMessage(dto);
        const imama: MessageImage[] = message.messageImages;
        // for (let i of dto.messageImages){
        //     imama.push(await ChatRepository.createMessageImage(i, message.id))
        // }
        // images.map(async (el) => {return await ChatRepository.createMessageImage(el, message.id)})
        const data = await ChatRepository.getShortUserData(dto.senderId);
        if (!data) {
            throw new Error("???");
        }
        ChatRepository.markReadMessages(dto.senderId, [{ id: message.id }]);
        return {
            ...message,
            text: message.text!,
            messageImages: imama,
            sender: {
                id: data.id,
                username: data.username,
                profile: data.profile!,
            },
            senderId: dto.senderId,
        };
    },
    async getGroupChats(userId) {
        return await ChatRepository.getGroupChats(userId);
    },
    async createGroupChat(dto) {
        await ChatRepository.createGroupChat(dto);
    },
    async deleteChat(chatId) {
        await ChatRepository.deleteChat(chatId);
    },
    async editGroupChat(chatId, dto) {
        await ChatRepository.editGroupChat(chatId, dto);
    },
    async getChatMemberIds(chatId) {
        return await ChatRepository.getChatMemberIds(chatId);
    },
    async isGroupChat(chatId) {
        return await ChatRepository.isGroupChat(chatId);
    },
};
