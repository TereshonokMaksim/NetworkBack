import type { ClientSocket, SocketController } from "../../../socket/socket.types";
import type { AuthenticatedUser } from "../../../types/standartTypes";
import type { Message, MessageFull, CreateMessageDto, ChatInfo, Chat, NewMessage, ShortUserData, ChatShort, ChatE, UnreadMessagesInfo, MessageImage, NewMessageFront, MessageFullFront } from "./chat.types";
import type { NextFunction, Request, Response } from "express";



export type filesLocals = {
    filename: string
    originalname: string
}


export type ChatControllerContract = {
	getAllMessagesByChat(
		req: Request<
			{ chatId: string },
			MessageFullFront[],
			object,
			{page: string, take: string},
			AuthenticatedUser
		>,
		res: Response<MessageFullFront[], AuthenticatedUser>,
		next: NextFunction,
	): Promise<void>;
    openPersonalChat(
        req: Request<
            {userId: string},
            ChatInfo,
            object,
            object,
            AuthenticatedUser
        >,
        res: Response<ChatInfo, AuthenticatedUser>,
        next: NextFunction
    ): Promise<void>
    getPersonalChats(
        req: Request<
            object,
            ChatShort[],
            object,
            object,
            AuthenticatedUser
        >,
        res: Response<ChatShort[], AuthenticatedUser>,
        next: NextFunction
    ): Promise<void>
    markMessage(
        req: Request<
            {msgId: string},
            {success: boolean},
            object,
            object,
            AuthenticatedUser
        >,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction
    ): Promise<void>
    getUnreadData(
        req: Request<
            object,
            UnreadMessagesInfo,
            object,
            object,
            AuthenticatedUser
        >,
        res: Response<UnreadMessagesInfo, AuthenticatedUser>,
        next: NextFunction
    ): Promise<void>,
    
    sendMessageWithImages: (
        req: Request<object, {success: boolean}, {chatId: number, text: string}, object, AuthenticatedUser & filesLocals>,
        res: Response<{success: boolean}, AuthenticatedUser & {files?: filesLocals[]}>,
        next: NextFunction,
    ) => Promise<void>;
};

export type ChatServiceContract = {
	getAllMessagesByChat(
        userId: number,
		chatId: number,
		take: number,
        page: number
	): Promise<MessageFullFront[]>; // Query/Read
	sendMessage(dto: CreateMessageDto): Promise<Message>;
    getChatInfo(chatId: number, userId: number): Promise<ChatInfo | null>
    getPersonalChat(userId: number, clientId: number): Promise<ChatInfo>
    getPersonalChats(userId: number): Promise<ChatShort[]>
    markReadMessage(userId: number, messageId: number): Promise<void>
    getUnreadData(userId: number): Promise<UnreadMessagesInfo>
    sendMessageWithImages(dto: CreateMessageDto): Promise<NewMessageFront>
};

export type ChatRepositoryContract = {
	getAllMessagesByChat(
		chatId: number,
		take: number,
        page: number
	): Promise<MessageFullFront[]>;
    markReadMessages(userId: number, messages: {id: number}[]): void;
	createMessage(data: CreateMessageDto): Promise<Message>;
    getChat(chatId: number): Promise<Chat | null>
    createPersonalChat(fromUserId: number, toUserId: number): Promise<Chat>
    getChatWithUsers(userOneId: number, userTwoId: number): Promise<Chat | null>
    getShortUserData(userId: number): Promise<ShortUserData | null>
    getPersonalChats(userId: number): Promise<ChatE[]>
    getGroupChats(userId: number): Promise<Chat[]>
    getChatLastMessage(chatId: number): Promise<MessageFullFront | null>
    getUnreadMessages(chatId: number, userId: number): Promise<number>
    createMessageImage(path: string, messageId: number): Promise<MessageImage>
};

export interface ChatClientEvents {
	sendMessage: (payload: CreateMessageDto) => void;
    enterChat: (payload: {chatId: number}) => void;
    leaveChat: (payload: {chatId: number}) => void;
}
export interface ChatServerEvents {
	newChatMessage: (message: NewMessageFront) => void;
}

export interface ChatSocketControllerContact extends SocketController {
	sendMessage: (socket: ClientSocket, payload: CreateMessageDto) => void;
    enterChat: (socket: ClientSocket, payload: {chatId: number}) => void;
    leaveChat: (socket: ClientSocket, payload: {chatId: number}) => void;
	newChatMessage: (socket: ClientSocket, payload: NewMessage) => void;
}