import { HandleDBError } from "../../errors/dbErrorHandler";
import { InternalServerError } from "../../errors/standartError";
import { PrismaClient } from "../../prisma/client";
import type { PostRepositoryContract } from "./types/post.contracts";

export const PostRepository: PostRepositoryContract = {
    async createPost(data) {
        try {
            return await PrismaClient.post.create({ data });
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async createPostImage(postId, originalPath, compressedPath) {
        try {
            return await PrismaClient.image.create({
                data: {
                    postOriginalId: postId,
                    originalImagePath: originalPath,
                    compressedImagePath: compressedPath,
                },
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
                    tag: {
                        omit: { createdAt: true },
                    },
                },
            });
            return tag.tag;
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
                    link: url,
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
            return await PrismaClient.image.findMany({
                where: { postOriginalId: postId },
            });
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
                    tag: {
                        omit: {
                            createdAt: true,
                        },
                    },
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
            return posts;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
    async getUserPosts(userId, skip, take) {
        try {
            const posts = await PrismaClient.post.findMany({ where: { authorId: userId }, skip, take, orderBy: {id: "desc"} });
            return posts;
        } catch (error) {
            HandleDBError(error);
            throw new InternalServerError("huh");
        }
    },
};
