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
}