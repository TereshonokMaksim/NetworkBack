import { Prisma } from "../../../generated/prisma";

export type Post =
    Prisma.PostGetPayload<{}>;
export type PostCreate =
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
export type PostUpdate = Partial<Prisma.PostGetPayload<{
        omit: {
            id: true;
            updatedAt: true;
            createdAt: true;
        };
    }>>

export type PostCreateDto = Omit<PostCreate, "authorId"> & {tagIds: string} & {links: string}
export type PostUpdateDto = Omit<Partial<PostCreate>, "authorId">

export type PostImage = Prisma.ImageGetPayload<{omit: {createdAt: true}}>
export type PostImageDto = {
    originalImagePath: string;
    compressedImagePath: string;
}
export type PostToShowExtract = Prisma.PostGetPayload<{omit: {updatedAt: true, createdAt: true}}>
export type PostToShow = PostToShowExtract & {images: PostImage[], tags: PostTag[], links: string[], authorUsername: string, authorAvatarPath: string | null}
export type PostTag = Prisma.TagGetPayload<{omit: {createdAt: true}}>

export type PostLink = Prisma.PostLinkGetPayload<{}>