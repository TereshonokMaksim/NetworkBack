import { HandleDBError } from "../../errors/dbErrorHandler";
import { InternalServerError } from "../../errors/standartError";
import { PrismaClient } from "../../prisma/client";
import type { PostRepositoryContract } from "./types/post.contracts";

export const PostRepository: PostRepositoryContract = {
    async createPost(data) {
        try {
            const post = await PrismaClient.post.create({ data: {
                authorId: data.authorId,
                title: data.title,
                content: data.text,
                topic: data.topic,
                created_at: new Date()
            } });
            return {
                id: post.id,
                authorId: post.authorId,
                title: post.title,
                topic: post.topic!,
                text: post.content,
                likes: 0,
                hearted: 0,
                watched: 0,
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async editPost(id, data) {
        try {
            const post = await PrismaClient.post.update({where: {id}, data: {
                title: data.title,
                content: data.text,
                topic: data.topic
            } });
            return {
                id: post.id,
                authorId: post.authorId,
                title: post.title,
                topic: post.topic!,
                text: post.content,
                likes: 0,
                hearted: 0,
                watched: 0,
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async deletePostImage(postImageId) {
        try {
            const data = await PrismaClient.postImage.delete({
                where: {id: postImageId}
            });
            return {
                compressedImagePath: data.compressed_image,
                originalImagePath: data.original_image,
                id: data.id,
                postOriginalId: data.postId
            }
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async createPostImage(postId, originalPath, compressedPath) {
        try {
            const i = await PrismaClient.postImage.create({
                data: {
                    postId: postId,
                    original_image: originalPath,
                    compressed_image: compressedPath,
                },
            });
            return {
                id: i.id,
                originalImagePath: originalPath,
                compressedImagePath: compressedPath,
                postOriginalId: postId
            } 
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async deletePostTag(tagId, postId) {
        try {
            await PrismaClient.postTag.deleteMany({
                where: {tagId, postId}
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async createPostTag(postId, tagId) {
        try {
            console.log("CREATING POSTTAG: ", postId, tagId)
            const tag = await PrismaClient.postTag.create({
                data: {
                    postId: postId,
                    tagId: +tagId,
                },
                select: {
                    tag: true
                },
            });
            return tag.tag;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async deletePostLink(postLinkId) {
        try {
            return await PrismaClient.postLink.delete({
                where: {id: postLinkId}
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async createPostLink(postId, url) {
        try {
            const postLink = await PrismaClient.postLink.create({
                data: {
                    postId: postId,
                    url: url,
                },
            });
            return postLink;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },

    async getPostImages(postId) {
        try {
            const oim = await PrismaClient.postImage.findMany({
                where: { postId },
            });
            const fim = oim.map(el => {return {id: el.id, originalImagePath: el.original_image, compressedImagePath: el.compressed_image, postOriginalId: postId}})
            return fim
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getPostTags(postId) {
        try {
            const tags = await PrismaClient.postTag.findMany({
                where: { postId },
                select: {
                    tag: true
                },
            });
            const tagsToThrow = [];
            for (let t of tags) {
                tagsToThrow.push(t.tag);
            }
            return tagsToThrow;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getPostLinks(postId) {
        try {
            const links = await PrismaClient.postLink.findMany({ where: {postId} });
            return links;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getAllPosts(skip, take) {
        try {
            console.log(skip, take)
            const posts = await PrismaClient.post.findMany({ skip, take, orderBy: {id: "desc"} });
            const cooked = posts.map(post => {return {
                id: post.id,
                authorId: post.authorId,
                title: post.title,
                topic: post.topic!,
                text: post.content,
                likes: 0,
                hearted: 0,
                watched: 0,
            }})
            return cooked;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getUserPosts(userId, skip, take) {
        try {
            const posts = await PrismaClient.post.findMany({ where: { authorId: userId }, skip, take, orderBy: {id: "desc"} });
            const cooked = posts.map(post => {return {
                id: post.id,
                authorId: post.authorId,
                title: post.title,
                topic: post.topic!,
                text: post.content,
                likes: 0,
                hearted: 0,
                watched: 0,
            }})
            return cooked;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async deletePost(postId) {
        try {
            await PrismaClient.postTag.deleteMany({where: {postId}})
            await PrismaClient.postLink.deleteMany({where: {postId}})
            await PrismaClient.postImage.deleteMany({where: {postId}})
            await PrismaClient.post.delete({
                where: {id: postId}
            });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    // async likePost(postId) {
    //     try {

    //     } catc
    // },
};
