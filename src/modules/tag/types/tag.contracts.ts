import { Tag, TagCreate } from "./tag.types";
import type { Request, Response, NextFunction } from "express";
import type { HandledErrorResponse } from "../../../types/standartTypes"


export type TagRepositoryContract = {
    createTag: (name: string) => Promise<Tag>
    getAllTags: () => Promise<Tag[]>
    getTagById: (id: number) => Promise<Tag | null>
}

export type TagServiceContract = {
    createTag: (data: TagCreate) => Promise<Tag>
    getAllTags: () => Promise<Tag[]>
    getTagById: (id: number) => Promise<Tag | null>
}

export type TagControllerContract = {
    createTag: (
        req: Request<object, Tag, TagCreate>,
        res: Response<Tag>,
        next: NextFunction
    ) => Promise<void>,
    getAllTags: (
        req: Request<object, Tag[]>,
        res: Response<Tag[]>,
        next: NextFunction
    ) => Promise<void>,
    getTagById: (
        req: Request<{id: string}, Tag | HandledErrorResponse>,
        res: Response<Tag | HandledErrorResponse>,
        next: NextFunction
    ) => Promise<void>
}