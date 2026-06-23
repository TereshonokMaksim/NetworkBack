import { TagControllerContract } from "./types/tag.contracts";
import { TagService } from "./tag.service";


export const TagController: TagControllerContract = {
    async createTag(req, res, next) {
        try {
            res.status(200).json(await TagService.createTag(req.body))
        } catch (error) {
            next(error)
        }
    },
    async getAllTags(req, res, next) {
        try {
            res.status(200).json(await TagService.getAllTags())
        } catch (error) {
            next(error)
        }
    },
    async getTagById(req, res, next) {
        try {
            if (!req.params.id){
                res.status(400).json({error: "No id provided!"})
                return
            }
            const id = +req.params.id
            if (Number.isNaN(id)){
                res.status(422).json({error: "Incorrect id!"})
                return
            }
            const tag = await TagService.getTagById(id)
            if (!tag) {
                res.status(404).json({error: "Tag not found!"})
                return
            }
            res.status(200).json(tag)
        } catch (error) {
            next(error)
        }
    },
}