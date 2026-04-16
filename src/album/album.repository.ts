import { PrismaClient } from '../prisma/client';

export const create = async (data: { title: string; description?: string; userId: string }) => {
    return await PrismaClient.album.create({
        data
    });
};

export const findByUserId = async (userId: string) => {
    return await PrismaClient.album.findMany({
        where: { userId }
    });
};

export const remove = async (id: string) => {
    return await PrismaClient.album.delete({
        where: { id }
    });
};