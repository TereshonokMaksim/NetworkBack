import { Prisma } form "../../generated/prisma";

export type Album = Prisma.AlbumGetPayload<{}>;
export type AlbumCreateInput = Prisma.AlbumUncheckedCreateInput;
export type AlbumModifyInput = Partial<Prisma.AlbumUncheckedUpdateInput>;
export type AlbumWithImages = Prisma.AlbumGetPayload<{ include: { previewImage: true, albumImages: { include: { image: true } }, tag: true } }>;

// DTO - Data Transfer Object
export type CreateAlbumDTO = {
    title: string,
    description?: string
}
export type GetAlbumsDTO = {
    userId: number
}
export type RemoveAlbumDTO = {
    albumId: number
}
export type AlbumServiceContract = {
    createAlbum(userId: number, title: string, description?: string): Promise<AlbumWithImages>,
    getUserAlbums(userId: number): Promise<AlbumWithImages[]>,
    removeAlbum(albumId: number): Promise<void>
}