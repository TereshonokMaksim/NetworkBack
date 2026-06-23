import { ChatControllerContract } from "./types/chat.contracts";
import { ChatService } from "./chat.service";
import { CHAT_ROOM_NAME_PREFIX } from "../../config/sockets";
import { MessageSocketController } from "./chat.socket.controller";
import { NewMessageFront, NewMessageNotification } from "./types/chat.types";


export const ChatController: ChatControllerContract = {
    async getAllMessagesByChat(req, res, next) {
        try {
            const take = +req.query.take
            const page = +req.query.page
            const chatId = +req.params.chatId
            res.status(200).json(await ChatService.getAllMessagesByChat(res.locals.userId, chatId, take, page))
        }
        catch (error){
            console.log("Unknown error at getAllMessagesByChat controller")
            console.error(error)
        }
    },
    async openPersonalChat(req, res, next) {
        try {
            const userId = +req.params.userId
            res.status(200).json(await ChatService.getPersonalChat(userId, res.locals.userId))
        }
        catch (error){
            console.log("Unknown error at openPersonalChat controller")
            console.error(error)
        }
    },
    async getPersonalChats(req, res, next) {
        try {
            const userId = +res.locals.userId
            res.status(200).json(await ChatService.getPersonalChats(userId))
        }
        catch (error){
            console.log("Unknown error at getPersonalChats controller")
            console.error(error)
        }
    },
    async markMessage(req, res, next) {
        try {
            const userId = +res.locals.userId
            await ChatService.markReadMessage(userId, +req.params.msgId)
            res.status(200).json({success: true})
        }
        catch (error){
            console.log("Unknown error at markMessage controller")
            console.error(error)
        }
    },
    async getUnreadData(req, res, next) {
        try {
            const userId = +res.locals.userId
            const data = await ChatService.getUnreadData(userId)
            res.status(200).json(data)
        }
        catch (error){
            console.log("Unknown error at getUnreadData controller")
            console.error(error)
        }
    },
    async sendMessageWithImages(req, res, next) {
        try {
            const chatId = +req.body.chatId
            const text = req.body.text
            const userId = res.locals.userId
            const data = await ChatService.sendMessageWithImages({
                senderId: userId,
                text,
                chatId: Number(chatId), 
                messageImages: res.locals.files ? res.locals.files.map(el => el.filename) : []
            })
            const ioServer = req.app.get("ioServer")
            ioServer.to(`${CHAT_ROOM_NAME_PREFIX}${chatId}`).emit("newChatMessage", data)
            const members = await ChatService.getChatMemberIds(chatId)
            const notification: NewMessageNotification = {
                        id: data.id,
                        chatId: data.chatId,
                        text: data.text,
                        senderId: data.senderId,
                        created_at: data.created_at,
                        isGroupMessage: await ChatService.isGroupChat(data.chatId),
                        sender: data.sender,
                        messageImages: data.messageImages
                    }
            for (const memId of members){
                MessageSocketController.sendMessageNotification(ioServer, {}, {data: notification, toUserId: memId})
            }
            
            res.status(200).json({success: true})
        }
        catch (error){
            console.log("Unknown error at sendMessageWithImages controller")
            console.error(error)
        }
    },
    async getGroupChats(req, res, next) {
        try {
            const userId = +res.locals.userId
            res.status(200).json(await ChatService.getGroupChats(userId))
        }
        catch (error){
            console.log("Unknown error at getGroupChats controller")
            console.error(error)
        }
    },
    async createGroupChat(req, res, next) {
        try {
            const userId = +res.locals.userId
            const chatId = req.body.chatId
            if (!chatId){
                await ChatService.createGroupChat({
                    creatorId: userId,
                    members: JSON.parse(req.body.members) as number[],
                    name: req.body.name,
                    avatarPath: req.file?.filename
                })
            }
            else {
                await ChatService.editGroupChat(
                    +chatId, 
                    {
                        creatorId: userId,
                        members: JSON.parse(req.body.members) as number[],
                        name: req.body.name,
                        avatarPath: req.file?.filename
                    }
                )
            }
            res.status(200).json({success: true})
        }
        catch (error){
            console.log("Unknown error at getGroupChats controller")
            console.error(error)
        }
    },
    async openGroupChat(req, res, next) {
        try {
            const userId = +res.locals.userId
            const chatId = +req.params.chatId
            res.status(200).json(await ChatService.getGroupChat(userId, chatId))
        }
        catch (error){
            console.log("Unknown error at openGroupChat controller")
            console.error(error)
        }
    },
    async deleteChat(req, res, next) {
        try {
            const chatId = +req.params.chatId
            await ChatService.deleteChat(chatId)
            res.status(200).json({success: true})
        }
        catch (error){
            console.log("Unknown error at openGroupChat controller")
            console.error(error)
        }
    },
}