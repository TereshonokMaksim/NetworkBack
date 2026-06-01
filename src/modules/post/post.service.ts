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
        let avatarPath: null | string | undefined = user.avatar
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
            let avatarPath: null | string | undefined = user.avatar
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
            let avatarPath: null | string | undefined = user.avatar
            cookedPosts.push({...post, images, tags, links: cookedLinks, authorUsername: user.username!, authorAvatarPath: avatarPath})
        }
        return cookedPosts
    },
    async editPost(postId, data, newImages, newTagIds, newLinks) {
        const images: PostImageDto[] = []
        if (newImages){
            for (let file of newImages){
                images.push({originalImagePath: file.originalname, compressedImagePath: file.filename})
            }
        }
        for (let im of (await PostRepository.getPostImages(postId))){
            console.log("Processing Image", im)
            await PostRepository.deletePostImage(im.id)
        }
        for (let tag of (await PostRepository.getPostTags(postId))){
            console.log("Processing Tag", tag)
            await PostRepository.deletePostTag(tag.id, postId)
        }
        for (let link of (await PostRepository.getPostLinks(postId))){
            console.log("Processing Link", link)
            await PostRepository.deletePostLink(link.id)
        }
        console.log("all deleted!")
        const post = await PostRepository.editPost(postId, data)
        const imagesCooked = []
        const tagsCooked = []
        const linksCooked = []
        for (let im of images){
            imagesCooked.push(await PostRepository.createPostImage(post.id, im.originalImagePath, im.compressedImagePath))
        }
        for (let tag of JSON.parse(newTagIds)){
            tagsCooked.push(await PostRepository.createPostTag(post.id, tag))
        }
        for (let l of JSON.parse(newLinks)){
            linksCooked.push((await PostRepository.createPostLink(post.id, l)).link)
        }
        const user = await UserRepository.findById(post.authorId)
        let avatarPath: null | string | undefined = user.avatar
        // if (user.currentAvatarId){
        //     const avatar = await UserRepository.getAvatarById(user.currentAvatarId)
        //     if (avatar){
        //         const image = await UserRepository.getImageById(avatar.imageId)!
        //         avatarPath = image.compressedImagePath
        //     }
        // }
        return {...post, images: imagesCooked, tags: tagsCooked, links: linksCooked, authorUsername: user.username!, authorAvatarPath: avatarPath}
    },
    async deletePost(postId) {
        return await PostRepository.deletePost(postId)
    },
}