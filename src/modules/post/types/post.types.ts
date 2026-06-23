import { Prisma } from "../../../generated/prisma";

export type Post = {
    id: number;
    authorId: number;
    title: string;
    topic: string;
    text: string;
    likes: number;
    hearted: number;
    watched: number;
}
export type PostCreate = {
    authorId: number;
    title: string;
    topic: string;
    text: string;
}
export type PostUpdate = {
    title?: string | undefined;
    topic?: string | undefined;
    text?: string | undefined;
}


export type PostRep =
    Prisma.PostGetPayload<{}>;
export type PostCreateRep =
    Prisma.PostGetPayload<{
        omit: {
            id: true;
            updatedAt: true;
            createdAt: true;
            likes: true;
            watched: true;
            hearted: true;
        };
    }>;
export type PostUpdateRep = Partial<Prisma.PostGetPayload<{
        omit: {
            authorId: true
            id: true;
            updatedAt: true;
            createdAt: true;
            likes: true;
            watched: true;
            hearted: true;
        };
    }>>
export type PostImage = {
    id: number;
    originalImagePath: string;
    compressedImagePath: string | null;
    postOriginalId: number | null;
}

export type PostCreateDto = Omit<PostCreate, "authorId"> & {tagIds: string, links: string}
export type PostUpdateDto = Omit<Partial<PostCreate>, "authorId"> & {tagIds?: string, links?: string}
export type PostImageRep = Prisma.PostImageGetPayload<{}>

export type PostImageDto = {
    originalImagePath: string;
    compressedImagePath: string;
}

export type PostToShowExtract = {
    id: number;
    authorId: number;
    title: string;
    topic: string;
    text: string;
    likes: number;
    hearted: number;
    watched: number;
}
export type PostToShow = {
    id: number;
    authorId: number;
    title: string;
    topic: string;
    text: string;
    likes: number;
    hearted: number;
    watched: number;
    images: {
        id: number;
        originalImagePath: string;
        compressedImagePath: string | null;
        postOriginalId: number | null;
    }[];
    tags: {
        name: string;
        id: number;
    }[];
    links: string[];
    authorUsername: string;
    authorAvatarPath: string | null | undefined;
}

export type PostToShowExtractRep = Prisma.PostGetPayload<{}>
export type PostToShowRep = PostToShowExtract & {images: PostImage[], tags: PostTag[], links: string[], authorUsername: string, authorAvatarPath: string | null}
export type PostTag = Prisma.TagGetPayload<{}>

export type PostLink = Prisma.PostLinkGetPayload<{}>