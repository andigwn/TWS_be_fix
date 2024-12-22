import Joi from "joi";

const createKosValidation = Joi.object({
    nama_kos: Joi.string().max(100).required(),
    pemilik_kos: Joi.string().max(100).required(),
    alamat_kos: Joi.string().max(255).required(),
    description: Joi.string().max(191).optional(),
    image: Joi.string().optional(),
});

const getKosValidation = Joi.number().positive().required();

const updateKosValidation = Joi.object({
    id: Joi.number().positive().required(),
    nama_kos: Joi.string().max(100).optional(),
    pemilik_kos: Joi.string().max(100).optional(),
    alamat_kos: Joi.string().max(255).optional(),
    description: Joi.string().max(191).optional(),
    image: Joi.string().optional(),
});

const searchKosValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    nama_kos: Joi.string().optional(),
    pemilik_kos: Joi.string().optional(),
    alamat_kos: Joi.string().optional(),
})


export { createKosValidation, getKosValidation, updateKosValidation, searchKosValidation };