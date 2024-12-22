import { ResponseError } from "../error/response_error.js";
import { getUserValidation, updateUserVaidation, userLoginValidation, userRegisterValidation } from "../validation/user_validation.js";
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt";
import { prismaClient } from "../application/database.js";
import { generateToken } from "../helpers/jwt.helper.js";

const register = async (request) => {
    const user = validate(userRegisterValidation, request);
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });
    if (countUser === 1) {
        throw new ResponseError(400, "username already Registered");
    }
    user.password = await bcrypt.hash(user.password, 10);
    return await prismaClient.user.create({
        data: user,
        select: {
            username: true,
            email: true,
            name: true

        }
    })
}

const login = async (request) => {
    const loginRequest = validate(userLoginValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true,
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "username or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "username or password wrong");
    }

    // Generate JWT token
    const token = generateToken(user);

    // Save token to database
    await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            token: token
        },
    });
    return { token: token, role: user.role };
}

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            email: true,
        }
    });

    if (!user) {
        throw new ResponseError(404, "user not found");
    }
    return user
}

const update = async (request) => {
    const user = validate(updateUserVaidation, request);
    const countUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });
    if (countUserInDatabase !== 1) {
        throw new ResponseError(404, "user not found");
    }
    const data = {}
    if (user.email) {
        data.email = user.email
    }
    if (user.name) {
        data.name = user.name
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10)
    }
    return await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            email: true,
            name: true
        }
    })
}

const logout = async (username) => {
    username = validate(getUserValidation, username);
    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            token: true
        }
    });
    if (!user) {
        throw new ResponseError(404, "user not found");
    }
    return await prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

export default { register, login, get, update, logout }