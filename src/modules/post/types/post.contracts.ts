import type {
    PostCreate,
    Post,
    PostCreateDto,
    PostImage,
    PostToShowExtract,
    PostToShow,
    PostTag,
    PostLink,
    PostUpdate,
    PostUpdateDto
} from "./post.types";
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../../../types/standartTypes";

export type filesLocals = {
    filename: string
    originalname: string
}

export type PostRepositoryContract = {
    createPost: (data: PostCreate) => Promise<Post>;
    editPost: (id: number, data: PostUpdate) => Promise<Post>;
    deletePostImage: (postImageId: number) => Promise<PostImage>;
    createPostImage: (postId: number, originalPath: string, compressedPath: string) => Promise<PostImage>;
    deletePostTag: (tagId: number, postId: number) => Promise<void>
    createPostTag: (postId: number, tagId: number) => Promise<PostTag>
    deletePostLink: (postLinkId: number) => Promise<PostLink>
    createPostLink: (postId: number, url: string) => Promise<PostLink>

    getUserPosts: (userId: number, skip: number, take: number) => Promise<PostToShowExtract[]>;
    getPostImages: (postId: number) => Promise<PostImage[]>;
    getPostTags: (postId: number) => Promise<PostTag[]>;
    getPostLinks: (postId: number) => Promise<PostLink[]>
    getAllPosts: (skip?: number, take?: number) => Promise<PostToShowExtract[]>;

    deletePost: (postId: number) => Promise<void>
    // likePost: (postId: number) => Promise<{success: boolean}>
    // unlikePost: (postId: number) => Promise<{success: boolean}>
    // heartPost: (postId: number) => Promise<{success: boolean}>
    // unheartPost: (postId: number) => Promise<{success: boolean}>
};

export type PostServiceContract = {
    createPost: (data: PostCreate, images: filesLocals[] | undefined, tagIds: string, links: string) => Promise<PostToShow>;

    getUserPosts: (userId: number, pageNumber: number, postsPerPage: number) => Promise<PostToShow[]>;
    getAllPosts: (page: number, postsPerPage: number) => Promise<PostToShow[]>;

    editPost: (postId: number, data: PostUpdate, newImages: filesLocals[] | undefined, newTagIds: string, newLinks: string) => Promise<PostToShow>;
    deletePost: (postId: number) => Promise<void>
};

export type PostControllerContract = {
    createPost: (
        req: Request<object, PostToShow, PostCreateDto, object, AuthenticatedUser & filesLocals>,
        res: Response<PostToShow, AuthenticatedUser & {files?: filesLocals[]}>,
        next: NextFunction,
    ) => Promise<void>;
    getUserPosts: (
        req: Request<{pageNumber: string}, PostToShow[], object, object, AuthenticatedUser>,
        res: Response<PostToShow[], AuthenticatedUser>,
        next: NextFunction
    ) => Promise<void>;
    getSomeonePosts: (
        req: Request<object, PostToShow[], object, {pageNumber: string, someoneId: string}, AuthenticatedUser>,
        res: Response<PostToShow[], AuthenticatedUser>,
        next: NextFunction
    ) => Promise<void>;
    getAllPosts: (
        req: Request<{pageNumber: string}, PostToShow[]>,
        res: Response<PostToShow[]>,
        next: NextFunction
    ) => Promise<void>
    editPost: (
        req: Request<{id: string}, PostToShow | {error: string}, PostUpdateDto, object, AuthenticatedUser & filesLocals>,
        res: Response<PostToShow | {error: string}, AuthenticatedUser & {files?: filesLocals[]}>,
        next: NextFunction,
    ) => Promise<void>
    deletePost: (
        req: Request<{id: string}, {success: boolean}, object, object, AuthenticatedUser>,
        res: Response<{success: boolean}, AuthenticatedUser>,
        next: NextFunction,
    ) => Promise<void>
};
