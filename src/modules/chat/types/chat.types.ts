import { Prisma } from "../../../generated/prisma";


export interface CreateGroupDto {
    name: string,
    avatarPath: string | undefined | null,
    members: number[],
    creatorId: number
}

export interface CreateGroupDataBody {
    chatId?: number,
    name: string,
    members: string
}

export interface UnreadMessagesInfo {
    unreadPersonalChats: number,
    unreadGroupChats: number
}
export type ShortUserData = {
    id: number,
    name: string | null,
    surname: string | null,
    username: string;
    profile: {
        avatar: string | null
    }
}
export type Chat = Prisma.ChatGetPayload<{include: {messages: true}}>
export type Message = Prisma.MessageGetPayload<{}>
export type MessageFull = Prisma.MessageGetPayload<{
    include: {
        messageReaders: {
            select: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        },
        sender: {
            select: {
                id: true,
                name: true,
                surname: true,
                profile: {
                    select: {
                        avatar: true
                    }
                }
            }
        },
        messageImages: {
            select: {
                id: true,
                image: true
            }
        }
    }
}>
export type MessageFullFront = {
    sender: {
        id: number;
        username: string;
        profile: {
            avatar: string | null;
        };
    };
    messageReaders: {
        user: {
            id: number;
        };
    }[];
    messageImages: {
        id: number;
        image: string;
    }[];
    id: number;
    text: string;
    chatId: number;
    created_at: Date;
    senderId: number;
}
export type MessageImage = {
    id: number;
    image: string;
}
export type CreateMessageDto = {
    senderId: number,
    chatId: number,
    text: string,
    messageImages: string[]
}
export type ChatInfo = {
    id: number,
    name: string | null,
    isGroup: boolean,
    messages: MessageFullFront[],
    avatar: string | null | undefined,
    peopleOnline: number[],
    userIsAdmin: boolean
    totalMembers: number
    memberIds: number[]
}
export type ChatE = Chat & {chatUsers: {
    userId: number;
}[]}
export type ChatShort = {
    id: number,
    name: string | null,
    isGroup: boolean,
    isOnline: boolean,
    lastMessage: MessageFullFront | null,
    avatar: string | null | undefined,
    peopleOnline: number[],
    userIsAdmin: boolean
    userId: number
    messagesUnread: number
}
export type ChatShortGroup = {
    id: number,
    name: string,
    currentlyOnline: number,
    lastMessage: MessageFullFront | null,
    avatar: string | null | undefined,
    peopleOnline: number[],
    userIsAdmin: boolean
    messagesUnread: number
}
export type NewMessage = Prisma.MessageGetPayload<{
    include: {
        sender: {
            select: {
                id: true,
                username: true,
                profile: {
                    select: {
                        avatar: true
                    }
                }
            }
        },
        messageImages: {
            select: {
                id: true,
                image: true
            }
        }
    }
}>
export type NewMessageFront = {
    sender: {
        id: number;
        username: string;
        profile: {
            avatar: string | null;
        } | null;
    };
    messageImages: {
        id: number;
        image: string;
    }[];
    id: number;
    text: string;
    chatId: number;
    created_at: Date;
    senderId: number;
}

export interface NewMessageNotification {
    sender: {
        id: number;
        username: string;
        profile: {
            avatar: string | null;
        } | null;
    };
    messageImages: {
        id: number;
        image: string;
    }[];
    id: number;
    text: string;
    chatId: number;
    created_at: Date;
    senderId: number;
    isGroupMessage: boolean;
}

export interface GroupOnlineData {
    membersTotal: number,
    membersOnline: number
}