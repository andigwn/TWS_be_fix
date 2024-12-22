import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION } from "../config/jwt.js";

export const generateToken = (user) => {
    // Kombinasikan informasi role dari database dengan token
    return jwt.sign({
        username: user.username,
        role: user.role,
        sessionId: crypto.randomUUID(), // Tambahkan session ID unik
        iat: Date.now()
    }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
        algorithm: 'HS512' // Gunakan algoritma yang lebih kuat
    });
};