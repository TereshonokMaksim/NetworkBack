import { PostRepository } from "./post.repository";
import { UserRepository } from "./@x";
import type { PostServiceContract } from "./types/post.contracts";
import { PostImageDto } from "./types/post.types";


export const PostService: PostServiceContract = {
    async createPost(data, files, tagIds, links) {
        const images: PostImageDto[] = []
        if (files){
            for (let file of files){
                images.push({originalImagePath: file.originalname, compressedImagePath: file.filename})
            }
        }
        const post = await PostRepository.createPost(data)
        const imagesCooked = []
        const tagsCooked = []
        const linksCooked = []
        for (let im of images){
            imagesCooked.push(await PostRepository.createPostImage(post.id, im.originalImagePath, im.compressedImagePath))
        }
        for (let tag of JSON.parse(tagIds)){
            tagsCooked.push(await PostRepository.createPostTag(post.id, tag))
        }
        for (let l of JSON.parse(links)){
            linksCooked.push((await PostRepository.createPostLink(post.id, l)).link)
        }
        const user = await UserRepository.findById(data.authorId)
        let avatarPath: null | string = null
        if (user.currentAvatarId){
            const avatar = await UserRepository.getAvatarById(user.currentAvatarId)
            if (avatar){
                const image = await UserRepository.getImageById(avatar.imageId)!
                avatarPath = image.compressedImagePath
            }
        }
        return {...post, images: imagesCooked, tags: tagsCooked, links: linksCooked, authorUsername: user.username!, authorAvatarPath: avatarPath}
    },
    async getAllPosts(page, postsPerPage) {
        const posts = await PostRepository.getAllPosts(page * postsPerPage, postsPerPage)
        const cookedPosts = []
        for (let post of posts){
            const images = await PostRepository.getPostImages(post.id)
            const tags = await PostRepository.getPostTags(post.id)
            const links = await PostRepository.getPostLinks(post.id)
            const cookedLinks = []
            for (let l of links){
                cookedLinks.push(l.link)
            }
            const user = await UserRepository.findById(post.authorId)
            let avatarPath: null | string = null
            if (user.currentAvatarId){
                const avatar = await UserRepository.getAvatarById(user.currentAvatarId)
                if (avatar){
                    const image = await UserRepository.getImageById(avatar.imageId)!
                    avatarPath = image.compressedImagePath
                }
            }
            cookedPosts.push({...post, images, tags, links: cookedLinks, authorUsername: user.username!, authorAvatarPath: avatarPath})
        }
        return cookedPosts
    },
    async getUserPosts(userId, pageNumber, postsPerPage) {
        const posts = await PostRepository.getUserPosts(userId, pageNumber * postsPerPage, postsPerPage)
        const cookedPosts = []
        for (let post of posts){
            const images = await PostRepository.getPostImages(post.id)
            const tags = await PostRepository.getPostTags(post.id)
            const links = await PostRepository.getPostLinks(post.id)
            const cookedLinks = []
            for (let l of links){
                cookedLinks.push(l.link)
            }
            const user = await UserRepository.findById(post.authorId)!
            let avatarPath: null | string = null
            if (user.currentAvatarId){
                const avatar = await UserRepository.getAvatarById(user.currentAvatarId)
                if (avatar){
                    const image = await UserRepository.getImageById(avatar.imageId)!
                    avatarPath = image.compressedImagePath
                }
            }
            cookedPosts.push({...post, images, tags, links: cookedLinks, authorUsername: user.username!, authorAvatarPath: avatarPath})
        }
        return cookedPosts
    },
}