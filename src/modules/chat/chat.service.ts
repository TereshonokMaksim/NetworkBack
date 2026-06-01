import { ChatRepository } from "./chat.repository";
import { ChatServiceContract } from "./types/chat.contracts";
import { UserRepository } from "./@x"
import { ChatShort, MessageImage, UnreadMessagesInfo } from "./types/chat.types";
import { User } from "../user/types/user.types";


export const ChatService: ChatServiceContract = {
    async getAllMessagesByChat(userId, chatId, take, page) {
        const messages = await ChatRepository.getAllMessagesByChat(chatId, take, page) 
        ChatRepository.markReadMessages(userId, messages)
        return messages
    },
    async sendMessage(dto) {
        return await ChatRepository.createMessage(dto)
    },
    async getChatInfo(chatId, userId) {
        const chat = await ChatRepository.getChat(chatId)
        if (!chat) return null
        const messages = await ChatRepository.getAllMessagesByChat(chatId, 20, 0)
        return {
            id: chat.id,
            name: chat.name,
            avatar: chat.avatar,
            isGroup: chat.is_group,
            userIsAdmin: chat.adminId === userId,
            messages: messages,
            peopleOnline: []
        }
    },
    async getPersonalChat(userId, clientId) {
        const userData = await UserRepository.findById(userId)
        const chat = await ChatRepository.getChatWithUsers(userId, clientId)
        if (chat) {
            const messa = await ChatRepository.getAllMessagesByChat(chat.id, 20, 0)
            ChatRepository.markReadMessages(clientId, messa)
            return {
                id: chat.id,
                name: `${userData.name} ${userData.surname}`,
                avatar: userData.avatar,
                isGroup: false,
                userIsAdmin: false,
                messages: messa,
                peopleOnline: []
            }
        }
        const newChat = await ChatRepository.createPersonalChat(clientId, userId)
        return {
            id: newChat.id,
            name: `${userData.name} ${userData.surname}`,
            avatar: userData.avatar,
            isGroup: false,
            userIsAdmin: false,
            messages: [],
            peopleOnline: []
        }
    },
    async getPersonalChats(userId) {
        const chats = await ChatRepository.getPersonalChats(userId)
        const cookedChats: ChatShort[] = []
        for (let chat of chats){
            let userData: User
            if (userId === chat.chatUsers[0]!.userId){
                userData = await UserRepository.findById(chat.chatUsers[1]!.userId)
            }
            else {
                userData = await UserRepository.findById(chat.chatUsers[0]!.userId)
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
                messagesUnread: await ChatRepository.getUnreadMessages(chat.id, userId)
            })
        }
        return cookedChats
    },
    async markReadMessage(userId, messageId) {
        await ChatRepository.markReadMessages(userId, [{id: messageId}])
    },
    async getUnreadData(userId) {
        const data: UnreadMessagesInfo = {
            unreadGroupChats: 0,
            unreadPersonalChats: 0
        }
        const groups = await ChatRepository.getGroupChats(userId)
        const personal = await ChatRepository.getPersonalChats(userId)
        for (let gr of groups){
            data.unreadGroupChats += await ChatRepository.getUnreadMessages(gr.id, userId)
        }
        for (let pers of personal){
            data.unreadPersonalChats += await ChatRepository.getUnreadMessages(pers.id, userId)
        }
        return data
    },
    async sendMessageWithImages(dto) {
        const message = await ChatRepository.createMessage(dto)
        const imama: MessageImage[] = [];
        for (let i of dto.messageImages){
            imama.push(await ChatRepository.createMessageImage(i, message.id))
        }
        // images.map(async (el) => {return await ChatRepository.createMessageImage(el, message.id)})
        const data = await ChatRepository.getShortUserData(dto.senderId)
        if (!data){
            throw new Error("???")
        }
        return {...message, messageImages: imama, sender: {
            id: data.id,
            name: data.name,
            surname: data.surname,
            profile: data.profile!

        }, senderId: dto.senderId}
    },
}