import { prismaClient } from "../application/database.js";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/jwt.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ errors: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'] });

        const user = await prismaClient.user.findFirst({
            where: {
                username: decoded.username,
                token: token
            },
            select: {
                username: true,
                role: true,
                token: true
            }
        });

        if (!user) {
            return res.status(401).json({ errors: "Invalid session" });
        }

        // No need to check role equality here as it's handled by requireRole middleware
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ errors: "Invalid token" });
    }
};