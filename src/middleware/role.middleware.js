export const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user || !allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    errors: "Access denied"
                });
            }

            next();
        } catch (error) {
            res.status(403).json({ errors: "Permission denied" });
        }
    };
};