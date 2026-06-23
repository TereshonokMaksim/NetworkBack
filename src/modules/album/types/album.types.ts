import { Prisma } from "../../../generated/prisma";


export type Album = {
    name: string;
    id: number;
    userId: number;
    previewImageId: number | null;
    shown: boolean;
    tag: string;
    createdAt: Date;
    year: number;
    avatarOnly: boolean;
}
export type AlbumCreate = {
    name: string;
    tag: string;
    year: number;
    avatarOnly: boolean;
}
export type AlbumEdit = {
    name?: string | undefined;
    shown?: boolean | undefined;
    tag?: string | undefined;
    year?: number | undefined
}

export type AlbumRep =
    Prisma.AlbumGetPayload<{}>;
export type AlbumCreateRep =
    Prisma.AlbumGetPayload<{
        omit: {
            shown: true;
            id: true;
            createdAt: true;
        };
    }>;
export type AlbumEditRep = Partial<
    Prisma.AlbumGetPayload<{
        omit: {
            id: true;
            createdAt: true;
            profileId: true; 
        };
    }>
>;

export type AlbumImage = {
    id: number;
    shown: boolean;
    image: string;
    albumId: number;
}
export type AlbumImageForShow ={
    id: number;
    shown: boolean;
    originalImagePath: string,
    albumId: number;
};
export type AlbumImageCreate = {
    image: string;
    albumId: number;
}

export type AlbumImageRep =
    Prisma.AlbumImageGetPayload<{}>;
export type AlbumImageEdit = {
    is_shown: boolean
}