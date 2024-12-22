import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response_error.js";
import { createKosValidation, getKosValidation, searchKosValidation, updateKosValidation } from "../validation/kos_validation.js"
import { validate } from "../validation/validation.js";
import path from 'path';
import fs from 'fs/promises';

const create = async (user, request, images) => {
    const kos = validate(createKosValidation, request);
    let imagesPaths = [];

    // Handle both single and multiple images
    if (images) {
        const filesArray = Array.isArray(images) ? images : [images];
        imagesPaths = filesArray.map(image => `/uploads/images/${image.filename}`);
    } else {
        throw new ResponseError(400, "Image is required");
    }

    kos.username = user.username;
    const result = await prismaClient.kos.create({
        data: { ...kos, image: JSON.stringify(imagesPaths) },
        select: {
            id: true,
            nama_kos: true,
            pemilik_kos: true,
            alamat_kos: true,
            description: true,
            image: true
        }
    });

    // Parse the image JSON string before returning
    if (result.image) {
        result.image = JSON.parse(result.image);
    }
    return result;
}

const get = async (user, kosId) => {
    kosId = validate(getKosValidation, kosId);
    const result = await prismaClient.kos.findFirst({
        where: {
            username: user.username,
            id: kosId
        },
        select: {
            id: true,
            nama_kos: true,
            pemilik_kos: true,
            alamat_kos: true,
            description: true,
            image: true
        }
    });

    if (!result) {
        throw new ResponseError(404, "Data not found");
    }
    if (result.image) {
        result.image = JSON.parse(result.image);
    }
    return result;
}

const update = async (user, request, images) => {
    const kos = validate(updateKosValidation, request);
    const existingKos = await prismaClient.kos.findFirst({
        where: {
            username: user.username,
            id: kos.id
        }
    });

    if (!existingKos) {
        throw new ResponseError(404, "Data not found");
    }

    let imagesPaths = existingKos.image ? JSON.parse(existingKos.image) : [];

    if (images && images.length > 0) {
        // Delete old images
        try {
            for (const oldImagePath of imagesPaths) {
                const filePath = path.join(process.cwd(), oldImagePath.replace(/^\//, ''));
                await fs.unlink(filePath).catch(() => { });
            }
        } catch (error) {
            console.error('Error deleting old images:', error);
        }

        // Set new images
        imagesPaths = images.map(image => `/uploads/images/${image.filename}`);
    }

    const updatedKos = await prismaClient.kos.update({
        where: {
            id: kos.id
        },
        data: {
            nama_kos: kos.nama_kos,
            pemilik_kos: kos.pemilik_kos,
            alamat_kos: kos.alamat_kos,
            description: kos.description,
            image: JSON.stringify(imagesPaths)
        },
        select: {
            id: true,
            nama_kos: true,
            pemilik_kos: true,
            alamat_kos: true,
            description: true,
            image: true
        }
    });

    if (updatedKos.image) {
        updatedKos.image = JSON.parse(updatedKos.image);
    }
    return updatedKos;
}

const remove = async (user, kosId) => {
    kosId = validate(getKosValidation, kosId);
    const existingKos = await prismaClient.kos.findFirst({
        where: {
            username: user.username,
            id: kosId
        }
    });

    if (!existingKos) {
        throw new ResponseError(404, "Data not found");
    }

    // Delete associated images
    if (existingKos.image) {
        const images = JSON.parse(existingKos.image);
        for (const image of images) {
            try {
                const filePath = path.join(process.cwd(), image.replace(/^\//, ''));
                await fs.unlink(filePath).catch(() => { });
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
    }

    return await prismaClient.kos.delete({
        where: {
            id: kosId
        }
    });
}
const search = async (request) => {
    request = validate(searchKosValidation, request);
    const skip = (request.page - 1) * request.size;

    const filters = [];
    if (request.nama_kos) {
        filters.push({
            nama_kos: {
                contains: request.nama_kos
            }
        });
    }
    if (request.pemilik_kos) {
        filters.push({
            pemilik_kos: {
                contains: request.pemilik_kos
            }
        });
    }
    if (request.alamat_kos) {
        filters.push({
            alamat_kos: {
                contains: request.alamat_kos
            }
        });
    }

    const kos = await prismaClient.kos.findMany({
        where: {
            AND: filters,
        },
        take: request.size,
        skip: skip,
    });

    // Parse image JSON strings to arrays for all results
    kos.forEach(item => {
        if (item.image) {
            item.image = JSON.parse(item.image);
        }
    });

    const totalItems = await prismaClient.kos.count({
        where: {
            AND: filters
        }
    });

    return {
        data: kos,
        paging: {
            page: request.page,
            totalItems: totalItems,
            totalPage: Math.ceil(totalItems / request.size)
        }
    };
}
export default { create, get, update, remove, search }