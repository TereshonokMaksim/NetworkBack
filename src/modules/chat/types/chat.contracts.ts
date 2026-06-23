import type { ClientSocket, ServerSocket, SocketController } from "../../../socket/socket.types";
import type { AuthenticatedUser } from "../../../types/standartTypes";
import type { Message, MessageFull, CreateMessageDto, ChatInfo, Chat, NewMessage, ShortUserData, ChatShort, ChatE, UnreadMessagesInfo, MessageImage, NewMessageFront, MessageFullFront, ChatShortGroup, CreateGroupDto, CreateGroupDataBody, GroupOnlineData, NewMessageNotification } from "./chat.types";
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
    openGroupChat(
        req: Request<
            {chatId: string},
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

    getGroupChats(
        req: Request<
            object,
            ChatShortGroup[],
            object,
            object,
            AuthenticatedUser
        >,
        res: Response<ChatShortGroup[], AuthenticatedUser>,
        next: NextFunction
    ): Promise<void>
    createGroupChat(
        req: Request<
            object,
            {success: boolean},
            CreateGroupDataBody,
            object,
            AuthenticatedUser
        >,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction
    ): Promise<void>
    deleteChat(
        req: Request<
            { chatId: string },
            {success: boolean},
            object,
            object,
            AuthenticatedUser
        >,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction
    ): Promise<void>
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

    getGroupChats(userId: number): Promise<ChatShortGroup[]>
    createGroupChat(dto: CreateGroupDto): Promise<void>
    getGroupChat(userId: number, chatId: number): Promise<ChatInfo>
    deleteChat(chatId: number): Promise<void>
    editGroupChat(chatId: number, dto: CreateGroupDto): Promise<void>
    getChatMemberIds(chatId: number): Promise<number[]>
    isGroupChat(chatId: number): Promise<boolean>
};

export type ChatRepositoryContract = {
	getAllMessagesByChat(
		chatId: number,
		take: number,
        page: number
	): Promise<MessageFullFront[]>;
    markReadMessages(userId: number, messages: {id: number}[]): void;
	createMessage(data: CreateMessageDto): Promise<NewMessageFront>;
    getChat(chatId: number): Promise<Chat | null>
    createPersonalChat(fromUserId: number, toUserId: number): Promise<Chat>
    getChatWithUsers(userOneId: number, userTwoId: number): Promise<Chat | null>
    getShortUserData(userId: number): Promise<ShortUserData | null>
    getPersonalChats(userId: number): Promise<ChatE[]>
    getGroupChats(userId: number): Promise<ChatShortGroup[]>
    getChatLastMessage(chatId: number): Promise<MessageFullFront | null>
    getUnreadMessages(chatId: number, userId: number): Promise<number>
    createGroupChat(dto: CreateGroupDto): Promise<void>
    getChatMemberNumber(chatId: number): Promise<number>
    deleteChat(chatId: number): Promise<void>
    editGroupChat(chatId: number, dto: CreateGroupDto): Promise<void>
    getChatMemberIds(chatId: number): Promise<number[]>
    isGroupChat(chatId: number): Promise<boolean>
    // createMessageImage(path: string, messageId: number): Promise<MessageImage>
};

export interface ChatClientEvents {
	sendMessage: (payload: CreateMessageDto) => void;
    enterChat: (payload: {chatId: number}) => void;
    leaveChat: (payload: {chatId: number}) => void;
}
export interface ChatServerEvents {
	newChatMessage: (message: NewMessageFront) => void;
    groupOnlineUpdate: (data: GroupOnlineData) => void;
    messageNotification: (data: NewMessageNotification) => void;
}

export interface ChatSocketControllerContact extends SocketController {
	sendMessage: (ioServer: ServerSocket, socket: ClientSocket, payload: CreateMessageDto) => void;
    sendMessageNotification: (ioServer: ServerSocket, socket: object, payload: {data: NewMessageNotification, toUserId: number}) => void;
    enterChat: (ioServer: ServerSocket, socket: ClientSocket, payload: {chatId: number}) => void;
    leaveChat: (ioServer: ServerSocket, socket: ClientSocket, payload: {chatId: number}) => void;
	newChatMessage: (ioServer: ServerSocket, socket: ClientSocket, payload: NewMessage) => void;
    groupOnlineUpdate: (ioServer: ServerSocket, socket: ClientSocket, payload: {groupChatId: number, onlyToMyself?: boolean}) => void;
}

export interface ChatSocketDataContract {
    // Group Id: Set([memberId1, memberId2...])
    groupMembersListened: Map<number, Set<number>>;
    // Member Id: Set([groupId1, groupId2...])
    groupListeners: Map<number, Set<number>>;
}