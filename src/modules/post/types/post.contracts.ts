import type {
    PostCreate,
    Post,
    PostCreateDto,
    PostImage,
    PostToShowExtract,
    PostToShow,
    PostTag,
    PostLink
} from "./post.types";
import type { Tag } from "../@x"
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../../../types/standartTypes";

export type filesLocals = {
    filename: string
    originalname: string
}

export type PostRepositoryContract = {
    createPost: (data: PostCreate) => Promise<Post>;
    createPostImage: (postId: number, originalPath: string, compressedPath: string) => Promise<PostImage>;
    createPostTag: (postId: number, tagId: number) => Promise<PostTag>
    createPostLink: (postId: number, url: string) => Promise<PostLink>

    getUserPosts: (userId: number, skip: number, take: number) => Promise<PostToShowExtract[]>;
    getPostImages: (postId: number) => Promise<PostImage[]>;
    getPostTags: (postId: number) => Promise<PostTag[]>;
    getPostLinks: (postId: number) => Promise<PostLink[]>
    getAllPosts: (skip?: number, take?: number) => Promise<PostToShowExtract[]>;
};

export type PostServiceContract = {
    createPost: (data: PostCreate, images: filesLocals[] | undefined, tagIds: string, links: string) => Promise<PostToShow>;

    getUserPosts: (userId: number, pageNumber: number, postsPerPage: number) => Promise<PostToShow[]>;
    getAllPosts: (page: number, postsPerPage: number) => Promise<PostToShow[]>;
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
    getAllPosts: (
        req: Request<{pageNumber: string}, PostToShow[]>,
        res: Response<PostToShow[]>,
        next: NextFunction
    ) => Promise<void>
};
