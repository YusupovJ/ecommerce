import { Router } from "express";
import userConroller from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", userConroller.findAll);
userRouter.get("/:id", userConroller.findByID);
userRouter.post("/", userConroller.create);
userRouter.patch("/:id", userConroller.update);
userRouter.delete("/:id", userConroller.delete);

export default userRouter;
