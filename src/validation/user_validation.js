import Joi from "joi";

const userRegisterValidation = Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().max(255).email().required(),
    password: Joi.string().max(255).required(),
    name: Joi.string().max(100).required(),
    role: Joi.string().default("USER").optional()
});

const userLoginValidation = Joi.object({
    username: Joi.string().max(255).required(),
    password: Joi.string().max(255).required(),
});

const getUserValidation = Joi.string().max(255).required();

const updateUserVaidation = Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().max(255).email().optional(),
    password: Joi.string().max(255).optional(),
    name: Joi.string().max(100).optional(),
})

export { userRegisterValidation, userLoginValidation, getUserValidation, updateUserVaidation };