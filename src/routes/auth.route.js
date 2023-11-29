import { Router } from "express";
import authConroller from "../controllers/auth.controller.js";
import authGuard from "../middleware/authGuard.js";

const authRouter = Router();

authRouter.post("/login", authConroller.login);
authRouter.post("/register", authConroller.register);
authRouter.post("/refresh", authConroller.refresh);
authRouter.post("/logout", authGuard, authConroller.logout);

export default authRouter;
