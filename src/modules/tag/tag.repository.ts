import { HandleDBError } from "../../errors/dbErrorHandler";
import { InternalServerError } from "../../errors/standartError";
import { PrismaClient } from "../../prisma/client";
import { TagRepositoryContract } from "./types/tag.contracts";


export const TagRepository: TagRepositoryContract = {
    async createTag(name) {
        try {
            return await PrismaClient.tag.create({data: {name}})
        }
        catch (error) {
            HandleDBError(error)
            throw new InternalServerError("Uknown error at Tag creation")
        }
    },
    async getAllTags() {
        try {
            return await PrismaClient.tag.findMany()
        }
        catch (error) {
            HandleDBError(error)
            throw new InternalServerError("Uknown error at Tag creation")
        }
    },
    async getTagById(id) {
        try {
            return await PrismaClient.tag.findUnique({where: {id}})
        }
        catch (error) {
            HandleDBError(error)
            throw new InternalServerError("Uknown error at Tag creation")
        }
    },
}