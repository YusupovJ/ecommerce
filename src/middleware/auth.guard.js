import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

const authGuard = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new Error("You must be authorized");
        }

        const decodedToken = jwt.verify(token, env.ACCESS_TOKEN);
        req.id = decodedToken.id;
        req.role = decodedToken.role;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export default authGuard;
