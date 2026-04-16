import * as albumRepository from './album.repository';

export const createAlbum = async (userId: string, title: string, description?: string) => {
    const albumData = { title, userId, ...(description && { description }) };
    return await albumRepository.create(albumData);
};

export const getUserAlbums = async (userId: string) => {
    return await albumRepository.findByUserId(userId);
};

export const deleteAlbum = async (id: string) => {
    return await albumRepository.remove(id);
};