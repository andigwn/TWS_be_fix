import express from "express";
import userController from "../controller/user_controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import kosController from "../controller/kos_controller.js";
import kamarController from "../controller/kamar_controller.js";
import { upload } from "../middleware/upload_middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware)
// User API
userRouter.get("/api/users/current", requireRole(['ADMIN', 'USER']), userController.get);
userRouter.patch("/api/users/current", requireRole(['ADMIN', 'USER']), userController.update);
userRouter.delete("/api/users/logout", requireRole(['ADMIN', 'USER']), userController.logout);

// Kos API
userRouter.post("/api/kos", requireRole(['ADMIN']), upload.array("image", 5), kosController.create);
userRouter.get("/api/kos/:kosId", requireRole(['ADMIN', 'USER']), kosController.get);
userRouter.put("/api/kos/:kosId", requireRole(['ADMIN']), upload.array("image", 5), kosController.update);
userRouter.delete("/api/kos/:kosId", requireRole(['ADMIN']), kosController.remove);
userRouter.get("/api/kos", requireRole(['ADMIN', 'USER']), kosController.search);

// Kamar API
userRouter.post("/api/kos/:kosId/kamars", requireRole(['ADMIN']), upload.array("image", 5), kamarController.create);
userRouter.get("/api/kos/:kosId/kamars/:kamarId", requireRole(['ADMIN', 'USER']), kamarController.get);
userRouter.put("/api/kos/:kosId/kamars/:kamarId", requireRole(['ADMIN']), upload.array("image", 5), kamarController.update);
userRouter.delete("/api/kos/:kosId/kamars/:kamarId", requireRole(['ADMIN']), kamarController.remove);
userRouter.get("/api/kos/:kosId/kamars", requireRole(['ADMIN', 'USER']), kamarController.list);

export { userRouter }