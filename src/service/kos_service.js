import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response_error.js";
import { createKosValidation, getKosValidation, searchKosValidation, updateKosValidation } from "../validation/kos_validation.js"
import { validate } from "../validation/validation.js";

const create = async (user, request, images) => {
    const kos = validate(createKosValidation, request);
    let imagesPaths;

    // Handle both single and multiple images
    if (Array.isArray(images)) {
        imagesPaths = images.map(image => `${image.filename}`);
    } else if (images) {
        imagesPaths = [`${images.filename}`];
    } else {
        throw new ResponseError(400, "Image is required");
        // atau berikan default image path
    }
    kos.username = user.username
    return await prismaClient.kos.create({
        data: { ...kos, image: JSON.stringify(imagesPaths) },
        select: {
            id: true,
            nama_kos: true,
            pemilik_kos: true,
            alamat_kos: true,
            description: true,
            image: true
        }
    })
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
    return result;
}

const update = async (user, request, images) => {
    const kos = validate(updateKosValidation, request);
    const totalKosInDatabase = await prismaClient.kos.count({
        where: {
            username: user.username,
            id: kos.id
        }
    })
    if (totalKosInDatabase !== 1) {
        throw new ResponseError(404, "Data not found");
    }
    let imagesPaths = totalKosInDatabase.image ? JSON.parse(totalKosInDatabase.image) : [];

    if (images && Array.isArray(images) && images.length > 0) {
        // Delete old images
        try {
            const oldImages = JSON.parse(totalKosInDatabase.image || '[]');
            for (const oldImage of oldImages) {
                const filePath = path.join(process.cwd(), 'public', oldImage);
                await fs.unlink(filePath).catch(() => { });
            }
        } catch (error) {
            logger('Error deleting old images:', error);
        }

        // Set new images
        imagesPaths = images.map(image => `${image.filename}`);
    }
    return await prismaClient.kos.update({
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
    })
}

const remove = async (user, kosId) => {
    kosId = validate(getKosValidation, kosId);
    const kosTotalInDatabase = await prismaClient.kos.count({
        where: {
            username: user.username,
            id: kosId,

        }
    })
    if (kosTotalInDatabase !== 1) {
        throw new ResponseError(404, "Data not found");
    }

    return await prismaClient.kos.delete({
        where: {
            id: kosId
        },
    })

}

const search = async (request) => {
    request = validate(searchKosValidation, request);
    const skip = (request.page - 1) * request.size

    const filters = [];
    if (request.nama_kos) {
        filters.push({
            nama_kos: {
                contains: request.nama_kos
            }
        })
    }
    if (request.pemilik_kos) {
        filters.push({
            pemilik_kos: {
                contains: request.pemilik_kos
            }
        })
    }
    if (request.alamat_kos) {
        filters.push({
            alamat_kos: {
                contains: request.alamat_kos
            }
        })
    }
    const kos = await prismaClient.kos.findMany({
        where: {
            AND: filters,
        },
        take: request.size,
        skip: skip,
    });

    const totalItems = await prismaClient.kos.count({
        where: {
            AND: filters
        }
    })
    return {
        data: kos,
        paging: {
            page: request.page,
            totalItems: totalItems,
            totalPage: Math.ceil(totalItems / request.size)
        }
    }
}

export default { create, get, update, remove, search }