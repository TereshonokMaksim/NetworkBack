import { Prisma } from "../../../generated/prisma";

export type Album =
    Prisma.AlbumGetPayload<{}>;
export type AlbumCreate =
    Prisma.AlbumGetPayload<{
        omit: {
            shown: true;
            id: true;
            createdAt: true;
            previewImageId: true;
            userId: true;
        };
    }>;
export type AlbumEdit = Partial<
    Prisma.AlbumGetPayload<{
        omit: {
            id: true;
            createdAt: true;
        };
    }>
>;

export type AlbumImage =
    Prisma.AlbumImageGetPayload<{}>;
export type AlbumImageForShow ={
    id: number;
    shown: boolean;
    originalImagePath: string,
    albumId: number;
};
export type AlbumImageCreate =
    Prisma.AlbumImageGetPayload<{
        omit: {
            id: true;
            shown: true;
        };
    }>;
export type AlbumImageEdit = Partial<
    Prisma.AlbumImageGetPayload<{
        omit: {
            id: true;
        };
    }>
>;

export type Image =
    Prisma.ImageGetPayload<{}>;
