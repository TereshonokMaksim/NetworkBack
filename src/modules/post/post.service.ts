import { PostRepository } from "./post.repository";
import type { PostServiceContract } from "./types/post.contracts";


export const PostService: PostServiceContract = {
    async createPost(data, images, tagIds, links) {
        const post = await PostRepository.createPost(data)
        const imagesCooked = []
        const tagsCooked = []
        const linksCooked = []
        for (let im of images){
            imagesCooked.push(await PostRepository.createPostImage(post.id, im.originalImagePath, im.compressedImagePath))
        }
        for (let tag of tagIds){
            tagsCooked.push(await PostRepository.createPostTag(post.id, tag))
        }
        for (let l of links){
            linksCooked.push((await PostRepository.createPostLink(post.id, l)).link)
        }
        return {...post, images: imagesCooked, tags: tagsCooked, links: linksCooked}
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
            cookedPosts.push({...post, images, tags, links: cookedLinks})
        }
        return cookedPosts
    },
    async getUserPosts(userId) {
        const posts = await PostRepository.getUserPosts(userId)
        const cookedPosts = []
        for (let post of posts){
            const images = await PostRepository.getPostImages(post.id)
            const tags = await PostRepository.getPostTags(post.id)
            const links = await PostRepository.getPostLinks(post.id)
            const cookedLinks = []
            for (let l of links){
                cookedLinks.push(l.link)
            }
            cookedPosts.push({...post, images, tags, links: cookedLinks})
        }
        return cookedPosts
    },
    async getAllTags() {
        return PostRepository.getAllTags()
    },
}