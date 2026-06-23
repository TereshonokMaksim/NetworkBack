import type { ClientSocket, SocketManagerContract } from "../../socket/socket.types";
import type { UserSocketControllerContact } from "./types/user.contracts";
import { USER_ROOM_NAME_PREFIX } from "../../config/sockets";
import { GetUserStatusesResponse } from "./types/user.types";
import { UserSocketData as uData } from "./user.socket.data";
import { MessageSocketController } from "../chat/chat.socket.controller";
import { UserRepository } from "./user.repository";
// import type { CreateMessageDto, Message, NewMessage } from "./types/user.types";

export const UserSocketController: UserSocketControllerContact = {
    async userConnect(ioServer, socket, payload) {
        console.log(`CURRENT SITUATION:`);
        console.log(uData.userConnectionsMap);
        console.log(uData.userListenerMap);
        const userId = socket.data.userId;
        const roomName = `${USER_ROOM_NAME_PREFIX}${userId}`
        if (!socket.rooms.has(roomName)) {
            socket.join(roomName);
        }
        uData.userListenerMap.set(userId, new Set([]));
        const listeningArray = uData.userConnectionsMap.get(userId);
        if (listeningArray) {
            for (const listeningId of listeningArray) {
                this.notifyUser(ioServer, socket, { withUserId: userId, toUserId: listeningId });
            }
        }
        const groupData = await UserRepository.getUserGroupChatIds(userId)
        for (const groupId of groupData){
            MessageSocketController.groupOnlineUpdate(ioServer, socket, {groupChatId: groupId})
        }
    },
    async userDisconnect(ioServer, socket, payload) {
        const userId = socket.data.userId;
        const roomName = `${USER_ROOM_NAME_PREFIX}${userId}`
        if (socket.rooms.has(roomName)){
            socket.leave(roomName)
        }
        uData.userListenerMap.delete(userId);
        const listeningArray = uData.userConnectionsMap.get(userId);
        if (listeningArray) {
            for (const listeningId of listeningArray) {
                this.notifyUser(ioServer, socket, { withUserId: userId, toUserId: listeningId });
            }
        }
        const groupData = await UserRepository.getUserGroupChatIds(userId)
        for (const groupId of groupData){
            MessageSocketController.groupOnlineUpdate(ioServer, socket, {groupChatId: groupId})
        }
    },
    subscribeToStatusUpdates(ioServer, socket, payload) {
        console.log("Subscribing from user ", socket.data.userId)
        const userSet = new Set(payload.toUserIds)
        console.log(payload.toUserIds, userSet)
        const userId = socket.data.userId;
        uData.userListenerMap.set(userId, userSet);
        for (const listeningToId of payload.toUserIds) {
            if (uData.userConnectionsMap.has(listeningToId)) {
                uData.userConnectionsMap.get(listeningToId)!.add(userId);
            } else {
                uData.userConnectionsMap.set(listeningToId, new Set([userId]));
            }
        }
        this.sendUserStatuses(ioServer, socket, {forUserId: socket.data.userId})
    },
    sendUserStatuses(ioServer, socket, payload) {
        const response: GetUserStatusesResponse = { data: [] };
        const listeningTo = uData.userListenerMap.get(payload.forUserId);
        if (!listeningTo) {
            return;
        }
        for (const listeningUserId of listeningTo) {
            response.data.push({
                userId: listeningUserId,
                isOnline: uData.userListenerMap.has(listeningUserId),
            });
        }
        console.log("Sending statuses to ", socket.data.userId, "\n", response)
        socket.emit("sendUserStatuses", response);
    },
    notifyUser(ioServer, socket, payload) {
        const response: { userId: number; isOnline: boolean } = {
            userId: payload.withUserId,
            isOnline: uData.userListenerMap.has(payload.withUserId),
        };
        ioServer.to(`${USER_ROOM_NAME_PREFIX}${payload.toUserId}`).emit("notifyUser", response);
    },

    registerHandlers: function (socketManager: SocketManagerContract): void {
        socketManager.addEvent("userConnect", (socket, payload, ack?) => {
            this.userConnect.bind(this)(socketManager.ioServer, socket, payload);
        });
        socketManager.addEvent("subscribeToStatusUpdates", (socket, payload, ack?) => {
            this.subscribeToStatusUpdates.bind(this)(socketManager.ioServer, socket, payload);
        });
    },
};
