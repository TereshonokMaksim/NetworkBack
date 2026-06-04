import { ChatControllerContract } from "./types/chat.contracts";
import { ChatService } from "./chat.service";


export const ChatController: ChatControllerContract = {
    async getAllMessagesByChat(req, res, next) {
        try {
            console.log("getting all messages")
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
            const chatId = req.body.chatId
            const text = req.body.text
            const userId = res.locals.userId
            const data = await ChatService.sendMessageWithImages({
                senderId: userId,
                text,
                chatId: Number(chatId), 
                messageImages: res.locals.files ? res.locals.files.map(el => el.filename) : []
            })
            const ioServer = req.app.get("ioServer")
            console.log("io server")
            // console.log(ioServer)
            ioServer.to(`chatRoom-${chatId}`).emit("newChatMessage", data)
            res.status(200).json({success: true})
        }
        catch (error){
            console.log("Unknown error at sendMessageWithImages controller")
            console.error(error)
        }
    },
}