import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

const roleGuard = (...roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const { id, role } = jwt.verify(token, env.ACCESS_TOKEN);

            if (!roles.includes(role)) {
                const error = new Error("You don't have an access to this route");
                error.status = 403;
                throw error;
            }

            req.id = id;
            req.role = role;

            next();
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    };
};

export default roleGuard;
