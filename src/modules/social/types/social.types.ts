import { Prisma } from "../../../generated/prisma";


export type Relation = Prisma.UserSocialGetPayload<{}>
export type RelationCreate = Omit<Relation, "id">

export type ShortUserInfo = {
    id: number,
    avatar: string | null | undefined,
    username: string,
    pseudonym: string
}