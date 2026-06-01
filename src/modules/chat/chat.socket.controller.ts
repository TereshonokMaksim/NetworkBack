import type { ClientSocket, SocketManagerContract } from "../../socket/socket.types";
import { ChatService } from "./chat.service";
import { ChatRepository } from "./chat.repository";
import type { ChatSocketControllerContact } from "./types/chat.contracts";
import type { CreateMessageDto, Message, NewMessage } from "./types/chat.types";

export const MessageSocketController: ChatSocketControllerContact = {
	sendMessage: async function (
		socket: ClientSocket,
		payload: CreateMessageDto,
	): Promise<void> {
        console.log("GOT REQUEST.")
		try {
			const message = await ChatService.sendMessage({
				...payload,
				senderId: socket.data.userId,
			});
            const data = await ChatRepository.getShortUserData(socket.data.userId)
            if (!data) throw new Error("HOW")
			this.newChatMessage(socket, {...message, sender: data, messageImages: []});
		} catch (error) {
			console.error(error);
		}
	},
    enterChat: async function (socket, payload) {
        // TODO: defense mechanism against entering
        //       other peoples' chats
        console.log("Room connect")
        socket.join(`chatRoom-${payload.chatId}`)
    },
    leaveChat(socket, payload) {
        socket.leave(`chatRoom-${payload.chatId}`)
    },
	newChatMessage: function (socket: ClientSocket, payload: NewMessage): void {
        let socketName: string = "";
        console.log("Trying to send message")
        for (let sockNamePot of socket.rooms){
            if (sockNamePot.startsWith("chatRoom")){
                socketName = sockNamePot
                break
            }
        }
        console.log("Found room: ", socketName)
        socket.to(socketName).emit("newChatMessage", payload)
        socket.emit("newChatMessage", payload)
	},
	registerHandlers: function (socketManager: SocketManagerContract): void {
		socketManager.addEvent("sendMessage", this.sendMessage.bind(this));
        socketManager.addEvent("enterChat", this.enterChat.bind(this))
        socketManager.addEvent("leaveChat", this.leaveChat.bind(this))
	},
};