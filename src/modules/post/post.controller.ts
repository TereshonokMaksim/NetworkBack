import { PostControllerContract } from "./types/post.contracts";
import { PostService } from "./post.service";


const POSTS_PER_PAGE = 8

export const PostController: PostControllerContract = {
    async createPost(req, res, next) {
        try {
            let files = res.locals.files;
            const {tagIds, links, ...body} = req.body
            const postData = await PostService.createPost({...body, authorId: res.locals.userId}, files, tagIds, links)
            res.status(200).json(postData)
        } catch (error) {
			next(error);
        }
    },
    async getAllPosts(req, res, next) {
        try {
            const page = !Number.isNaN(+req.params.pageNumber) ? +req.params.pageNumber : 0
            res.status(200).json(await PostService.getAllPosts(page, POSTS_PER_PAGE))
        } catch (error) {
			next(error);
        }
    },
    async getUserPosts(req, res, next) {
        try {
            const page = !Number.isNaN(+req.params.pageNumber) ? +req.params.pageNumber : 0
            res.status(200).json(await PostService.getUserPosts(res.locals.userId, page, POSTS_PER_PAGE))
        } catch (error) {
			next(error);
        }
    },
    async getSomeonePosts(req, res, next) {
        try {
            const page = +req.query.pageNumber
            const id = +req.query.someoneId
            res.status(200).json(await PostService.getUserPosts(id, page, POSTS_PER_PAGE))
        } catch (error) {
			next(error);
        }
    },
    async editPost(req, res, next) {
        try {
            console.log("WHHY")
            if (!req.params) {
                res.status(400).json({error: "No id"})
                return
            }
            const id = +req.params.id
            if (Number.isNaN(id)) {
                res.status(422).json({error: "Wrong id"})
                return
            }
            let files = res.locals.files;
            console.log("Body")
            console.log(req.body)
            const {tagIds, links, ...body} = req.body
            console.log(id, body, files, tagIds ? tagIds : "", links ? links : "")
            const postData = await PostService.editPost(id, body, files, tagIds ? tagIds : "", links ? links : "")
            res.status(200).json(postData)
        } catch (error) {
			next(error);
        }
    },
    async deletePost(req, res, next) {
        try {
            if (!req.params) {
                res.status(400).json({success: false})
                return
            }
            const id = +req.params.id
            if (Number.isNaN(id)) {
                res.status(422).json({success: false})
                return
            }
            await PostService.deletePost(id)
            res.status(200).json({success: true})
        } catch (error) {
			next(error);
        }
    }
}