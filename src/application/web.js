import express from "express";
import { publicRouter } from "../route/public_api.js";
import { errorMiddleware } from "../middleware/error_middleware.js";
import { userRouter } from "../route/api.js";
import cors from "cors";

export const web = express();

web.use(express.json());
web.use(cors());
web.use(publicRouter)
web.use(userRouter);  // error middleware must be at the end of the middleware chain.
web.use(errorMiddleware);