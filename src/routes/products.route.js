import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import roleGuard from "../middleware/roleGuard.js";
import authGuard from "../middleware/authGuard.js";

const productRoute = Router();

productRoute.post("/", authGuard, roleGuard("moderator", "admin"), productsController.createProduct);
productRoute.get("/", productsController.getAll);

export default productRoute;
