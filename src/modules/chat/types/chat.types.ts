import { Prisma } from "../../../generated/prisma";


export interface UnreadMessagesInfo {
    unreadPersonalChats: number,
    unreadGroupChats: number
}
export type ShortUserData = {
    id: number,
    name: string | null,
    surname: string | null,
    profile: {
        avatar: string | null
    }
}
export type Chat = Prisma.ChatGetPayload<{}>
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
        name: string | null;
        id: number;
        surname: string | null;
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
export type MessageImage = Prisma.MessageImageGetPayload<{}>
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
}
export type ChatE = Chat & {chatUsers: {
        userId: number;
    }[];}
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
export type NewMessage = Prisma.MessageGetPayload<{
    include: {
        sender: {
            select: {
                id: true,
                first_name: true,
                last_name: true,
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
        name: string | null;
        id: number;
        surname: string | null;
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