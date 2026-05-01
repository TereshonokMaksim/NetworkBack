import { PostControllerContract } from "./types/post.contracts";
import { PostService } from "./post.service";
import { PostImageDto } from "./types/post.types";
import { originalFilesDir, thumbnailFilesDir } from "../../config/path";
import { PostRepository } from "./post.repository";


export const PostController: PostControllerContract = {
    async createPost(req, res, next) {
        try {
            let files: Express.Multer.File[] = [];
            if (req.files){
                if (Array.isArray(req.files)) {
                    files = req.files;
                } else {
                    for (let fileMap of Object.values(req.files)) {
                        files = [...files, ...fileMap];
                    }
                }
            }
            const images: PostImageDto[] = []
            for (let file of files){
                images.push({originalImagePath: file.originalname, compressedImagePath: file.filename})
            }
            const {tagIds, links, ...body} = req.body
            const postData = await PostService.createPost({...body, authorId: res.locals.userId}, images, tagIds, links)
            res.status(200).json(postData)
        } catch (error) {
			next(error);
        }
    },
    async getAllPosts(req, res, next) {
        try {
            res.status(200).json(await PostService.getAllPosts(+req.params.pageNumber, 5))
        } catch (error) {
			next(error);
        }
    },
    async getUserPosts(req, res, next) {
        try {
            res.status(200).json(await PostService.getUserPosts(res.locals.userId))
        } catch (error) {
			next(error);
        }
    },
    async getAllTags(req, res, next) {
        try {
            res.status(200).json(await PostService.getAllTags())
        } catch (error) {
			next(error);
        }
    },
}

            // let files: Express.Multer.File[] = [];
            // if (Array.isArray(req.files)) {
            //     files = req.files;
            // } else {
            //     for (let fileMap of Object.values(req.files)) {
            //         files = [...files, ...fileMap];
            //     }
            // }