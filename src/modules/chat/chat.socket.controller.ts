import type { ClientSocket, SocketManagerContract } from "../../socket/socket.types";
import { ChatService } from "./chat.service";
import { ChatRepository } from "./chat.repository";
import type { ChatSocketControllerContact } from "./types/chat.contracts";
import type {
    CreateMessageDto,
    GroupOnlineData,
    Message,
    NewMessage,
    NewMessageNotification,
} from "./types/chat.types";
import { CHAT_ROOM_NAME_PREFIX, USER_ROOM_NAME_PREFIX } from "../../config/sockets";
import { UserSocketData } from "../user/user.socket.data";
import { ChatSocketData as CSD } from "./chat.socket.data";

export const MessageSocketController: ChatSocketControllerContact = {
    sendMessage: async function (ioServer, socket, payload) {
        console.log("GOT REQUEST.");
        try {
            const message = await ChatService.sendMessage({
                ...payload,
                senderId: socket.data.userId,
            });
            const data = await ChatRepository.getShortUserData(socket.data.userId);
            if (!data) throw new Error("HOW");
            this.newChatMessage(ioServer, socket, {
                ...message,
                sender: { id: data.id, username: data.username!, profile: data.profile },
                messageImages: [],
            });
        } catch (error) {
            console.error(error);
        }
    },
    enterChat: async function (ioServer, socket, payload) {
        // TODO: defense mechanism against entering
        //       other peoples' chats
        console.log("Room connect");
        const ci = payload.chatId;
        if (!ci) {
            return;
        }
        socket.join(`${CHAT_ROOM_NAME_PREFIX}${ci}`);
        if (await ChatRepository.isGroupChat(ci)) {
            if (!CSD.groupMembersListened.has(ci)) {
                CSD.groupMembersListened.set(ci, new Set([socket.data.userId]));
            } else {
                CSD.groupMembersListened.get(ci)!.add(socket.data.userId);
            }
            this.groupOnlineUpdate(ioServer, socket, { groupChatId: ci, onlyToMyself: true });
        }
    },
    async leaveChat(ioServer, socket, payload) {
        const ci = payload.chatId;
        if (!ci) {
            return;
        }
        socket.leave(`${CHAT_ROOM_NAME_PREFIX}${ci}`);
        if (await ChatRepository.isGroupChat(ci)) {
            if (!CSD.groupMembersListened.has(ci)) {
                CSD.groupMembersListened.delete(socket.data.userId);
            }
        }
    },
    newChatMessage: async function (ioServer, socket, payload) {
        let socketName: string = "";
        console.log("Trying to send message");
        for (let sockNamePot of socket.rooms) {
            if (sockNamePot.startsWith(CHAT_ROOM_NAME_PREFIX)) {
                socketName = sockNamePot;
                break;
            }
        }
        const message = {
            ...payload,
            text: payload.text!,
            senderId: payload.senderId!,
            sender: {
                id: payload.sender!.id,
                username: payload.sender?.username ? payload.sender.username : "UnnamedS",
                profile: payload.sender!.profile,
            },
        };
        socket.to(socketName).emit("newChatMessage", message);
        socket.emit("newChatMessage", message);
        const members = await ChatRepository.getChatMemberIds(message.chatId);
        for (const memId of members) {
            this.sendMessageNotification(ioServer, socket, {
                data: { ...message, isGroupMessage: await ChatRepository.isGroupChat(message.chatId) },
                toUserId: memId,
            });
        }
    },
    async sendMessageNotification(ioServer, socket, payload) {
        const { data: notification, toUserId: userId } = payload;
        // console.log("Controller has to say: ", notification)
        const roomName = `${USER_ROOM_NAME_PREFIX}${userId}`;
        // console.log("Trying to send notification to ", roomName);
        if (!ioServer.sockets.adapter.rooms.has(roomName)) return;
        // console.log("Sending notification to ", roomName);
        ioServer.to(roomName).emit("messageNotification", notification);
    },
    async groupOnlineUpdate(ioServer, socket, payload) {
        const chatId = payload.groupChatId;
        const personal = payload.onlyToMyself;
        const roomName = `${CHAT_ROOM_NAME_PREFIX}${chatId}`;
        if (!ioServer.sockets.adapter.rooms.has(roomName)) return;
        const members = await ChatRepository.getChatMemberIds(chatId);
        let online = 0;
        for (const memId of members) {
            if (UserSocketData.userListenerMap.has(memId)) {
                online++;
            }
        }
        const data: GroupOnlineData = {
            membersTotal: members.length,
            membersOnline: online,
        };
        if (personal) {
            socket.emit("groupOnlineUpdate", data);
            return;
        }
        ioServer.to(roomName).emit("groupOnlineUpdate", data);
    },
    registerHandlers: function (socketManager: SocketManagerContract): void {
        socketManager.addEvent("sendMessage", (socket, payload) => {
            this.sendMessage.bind(this)(socketManager.ioServer, socket, payload);
        });
        socketManager.addEvent("enterChat", (socket, payload) => {
            this.enterChat.bind(this)(socketManager.ioServer, socket, payload);
        });
        socketManager.addEvent("leaveChat", (socket, payload) => {
            this.leaveChat.bind(this)(socketManager.ioServer, socket, payload);
        });
    },
};
