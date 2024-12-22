import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response_error.js";
import { createKamarValidation, getKamarValidation, updateKamarValidation } from "../validation/kamar_validation.js";
import { getKosValidation } from "../validation/kos_validation.js";
import { validate } from "../validation/validation.js";

const checkKos = async (user, kosId) => {
    kosId = validate(getKosValidation, kosId);
    const totalKosInDatabase = await prismaClient.kos.count({
        where: {
            username: user.username,
            id: kosId
        }
    })
    if (totalKosInDatabase !== 1) {
        throw new ResponseError(404, "Data not found");
    }
    return kosId
}

const create = async (user, kosId, request, images) => {
    kosId = await checkKos(user, kosId);
    const kamar = validate(createKamarValidation, request);
    kamar.kos_id = kosId
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
    return await prismaClient.kamar.create({
        data: { ...kamar, image: JSON.stringify(imagesPaths) },
        select: {
            id: true,
            nomor_kamar: true,
            harga: true,
            fasilitas: true,
            image: true
        }
    })
}

const get = async (user, kosId, kamarId) => {
    kosId = await checkKos(user, kosId);
    kamarId = validate(getKamarValidation, kamarId);
    const result = await prismaClient.kamar.findFirst({
        where: {
            kos_id: kosId,
            id: kamarId
        },
        select: {
            id: true,
            nomor_kamar: true,
            harga: true,
            fasilitas: true,
            image: true
        }
    });
    if (!result) {
        throw new ResponseError(404, "Data not found");
    }
    return result;
}

const update = async (user, kosId, request, images) => {
    kosId = await checkKos(user, kosId);
    const kamar = await validate(updateKamarValidation, request);
    const totalKamarInDatabase = await prismaClient.kamar.count({
        where: {
            kos_id: kosId,
            id: kamar.id
        },

    });
    if (totalKamarInDatabase !== 1) {
        throw new ResponseError(404, "Data not found");
    }
    let imagesPaths = totalKamarInDatabase.image ? JSON.parse(totalKamarInDatabase.image) : [];

    if (images && Array.isArray(images) && images.length > 0) {
        // Delete old images
        try {
            const oldImages = JSON.parse(totalKamarInDatabase.image || '[]');
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

    return await prismaClient.kamar.update({
        where: {
            id: kamar.id
        },
        data: {
            nomor_kamar: kamar.nomor_kamar,
            harga: kamar.harga,
            fasilitas: kamar.fasilitas,
            image: JSON.stringify(imagesPaths)
        },
        select: {
            id: true,
            nomor_kamar: true,
            harga: true,
            fasilitas: true,
            image: true
        }
    })
}

const remove = async (user, kosId, kamarId) => {
    kosId = await checkKos(user, kosId);
    kamarId = validate(getKamarValidation, kamarId);
    const totalKamarInDatabase = await prismaClient.kamar.count({
        where: {
            kos_id: kosId,
            id: kamarId
        }
    })
    if (totalKamarInDatabase !== 1) {
        throw new ResponseError(404, "Data not found");
    }
    return await prismaClient.kamar.delete({
        where: {
            id: kamarId
        },
    })
}

const list = async (kosId, request) => {
    kosId = await validate(getKosValidation, request);
    return await prismaClient.kamar.findMany({
        where: {
            kos_id: kosId
        },
        select: {
            id: true,
            nomor_kamar: true,
            harga: true,
            fasilitas: true,
            image: true
        }
    })
}

export default { create, get, update, remove, list };