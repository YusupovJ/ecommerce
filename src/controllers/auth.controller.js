import env from "../config/env.config.js";
import db from "../config/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const accessSecret = env.ACCESS_TOKEN;
const refreshSecret = env.REFRESH_TOKEN;

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", email);

            if (user) {
                const error = new Error("This user already exists");
                error.status = 400;
                throw error;
            }

            const hashedPassword = bcrypt.hashSync(password, 5);

            const newUser = {
                name,
                email,
                password: hashedPassword,
                role: "user",
            };

            const [{ insertId: id }] = await db.query("INSERT INTO users SET ?", newUser);

            const refreshToken = jwt.sign({ id: id, role: "user" }, refreshSecret, { expiresIn: "180s" });
            const accessToken = jwt.sign({ id: id, role: "user" }, accessSecret, { expiresIn: "60s" });

            res.json({ refreshToken, accessToken });

            const hashedRefreshToken = bcrypt.hashSync(refreshToken, 5);
            db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [hashedRefreshToken, id]);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", email);

            if (!user) {
                const error = new Error("Email or password are incorrect");
                error.status = 400;
                throw error;
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error("Email or password are incorrect");
                error.status = 400;
                throw error;
            }

            const refreshToken = jwt.sign({ id: user.id, role: user.role }, refreshSecret, { expiresIn: "180s" });
            const accessToken = jwt.sign({ id: user.id, role: user.role }, accessSecret, { expiresIn: "60s" });

            res.json({ refreshToken, accessToken });

            const hashedRefreshToken = bcrypt.hashSync(refreshToken, 5);

            db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [hashedRefreshToken, user.id]);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                const error = new Error("Refresh token must be provided");
                error.status = 400;
                throw error;
            }

            const decodedToken = jwt.verify(refreshToken, refreshSecret);
            const { id, role } = decodedToken;
            const [[user]] = await db.query("SELECT * FROM users WHERE id = ?", id);

            const isTokenCorrect = await bcrypt.compare(refreshToken, user.refresh_token);

            if (!isTokenCorrect) {
                const error = new Error("Access denied");
                error.status = 400;
                throw error;
            }

            const newRefreshToken = jwt.sign({ id, role }, refreshSecret, { expiresIn: "180s" });
            const newAccessToken = jwt.sign({ id, role }, accessSecret, { expiresIn: "60s" });

            res.json({ refreshToken: newRefreshToken, accessToken: newAccessToken });

            const hashedRefreshToken = bcrypt.hashSync(newRefreshToken, 5);
            db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [hashedRefreshToken, id]);
        } catch (error) {
            console.log(error);
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async logout(req, res) {
        try {
            await db.query("UPDATE users SET refresh_token = null WHERE id = ?", req.id);
            res.json({ message: "You logged out successfully" });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
}

export default new AuthController();
