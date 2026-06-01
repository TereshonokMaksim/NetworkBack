import { Prisma } from "../../../generated/prisma";


export type Relation = {
    id: number;
    firstUserId: number;
    secondUserId: number;
    status: string;
}
export type RelationCreate = {
    firstUserId: number;
    secondUserId: number;
    status: string;
}

export type RelationRep = Prisma.FriendShipGetPayload<{}>
export type RelationCreateRep = Omit<Relation, "id">
export type ShortUserInfo = {
    id: number,
    avatar: string | null | undefined,
    username: string,
    pseudonym: string
}