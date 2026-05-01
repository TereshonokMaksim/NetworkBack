import type {
    PostCreate,
    Post,
    PostCreateDto,
    PostImage,
    PostToShowExtract,
    PostToShow,
    PostTag,
    PostImageDto,
    PostLink,
    Tag
} from "./post.types";
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../../../types/standartTypes";

export type PostRepositoryContract = {
    createPost: (data: PostCreate) => Promise<Post>;
    createPostImage: (postId: number, originalPath: string, compressedPath: string) => Promise<PostImage>;
    createPostTag: (postId: number, tagId: number) => Promise<PostTag>
    createPostLink: (postId: number, url: string) => Promise<PostLink>

    getUserPosts: (userId: number) => Promise<PostToShowExtract[]>;
    getPostImages: (postId: number) => Promise<PostImage[]>;
    getPostTags: (postId: number) => Promise<PostTag[]>;
    getPostLinks: (postId: number) => Promise<PostLink[]>
    getAllPosts: (skip?: number, take?: number) => Promise<PostToShowExtract[]>;

    getAllTags: () => Promise<Tag[]>
};

export type PostServiceContract = {
    createPost: (data: PostCreate, images: PostImageDto[], tagIds: number[], links: string[]) => Promise<PostToShow>;

    getUserPosts: (userId: number) => Promise<PostToShow[]>;
    getAllPosts: (page: number, postsPerPage: number) => Promise<PostToShow[]>;
    getAllTags: () => Promise<Tag[]>
};

export type PostControllerContract = {
    createPost: (
        req: Request<object, PostToShow, PostCreateDto, object, AuthenticatedUser>,
        res: Response<PostToShow, AuthenticatedUser>,
        next: NextFunction,
    ) => Promise<void>;
    getUserPosts: (
        req: Request<object, PostToShow[], object, object, AuthenticatedUser>,
        res: Response<PostToShow[], AuthenticatedUser>,
        next: NextFunction
    ) => Promise<void>;
    getAllPosts: (
        req: Request<{pageNumber: string}, PostToShow[]>,
        res: Response<PostToShow[]>,
        next: NextFunction
    ) => Promise<void>
    getAllTags: (
        req: Request<object, Tag[]>,
        res: Response<Tag[]>,
        next: NextFunction
    ) => Promise<void>
};
