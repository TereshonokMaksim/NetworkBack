import type { TagServiceContract } from "./types/tag.contracts";
import { TagRepository } from "./tag.repository";
import { NotFoundError } from "../../errors/standartError";


export const TagService: TagServiceContract = {
    async createTag(data) {
        return TagRepository.createTag(data.name)
    },
    async getAllTags() {
        return TagRepository.getAllTags()
    },
    async getTagById(id) {
        const tag = await TagRepository.getTagById(id)
        if (!tag){
            throw new NotFoundError("Tag was not found")
        }
        return tag
    },
}