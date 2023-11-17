import { compareSync, hashSync } from "bcrypt";
import db from "../config/db.config.js";
import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const [[user]] = await db.query("SELECT email FROM users WHERE email = ?", email);

            if (user) {
                const error = new Error("User already exists");
                error.status = 406;
                throw error;
            }

            const hashedPassword = hashSync(password, 5);
            const newUser = {
                name,
                email,
                password: hashedPassword,
            };

            const [{ insertId }] = await db.query("INSERT INTO users SET ?", newUser);

            const refreshToken = jwt.sign({ id: insertId, role: "user" }, env.REFRESH_TOKEN, { expiresIn: "180s" });
            const accesshToken = jwt.sign({ id: insertId, role: "user" }, env.ACCESS_TOKEN, { expiresIn: "60s" });

            res.json({ refreshToken, accesshToken });

            const hashedRefreshToken = hashSync(refreshToken, 5);
            db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [hashedRefreshToken, insertId]);
        } catch (error) {
            res.status(error.status || 500).json({ message: "Register error: " + error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log(password, email);

            if (!email || !password) {
                const error = new Error("Password and email fields mustn't be empty!");
                error.status = 400;
                throw error;
            }

            const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", email);

            if (!user) {
                const error = new Error("Password or email are incorrect");
                error.status = 400;
                throw error;
            }

            const isRightPassword = compareSync(password, user.password);

            if (!isRightPassword) {
                const error = new Error("Password or email are incorrect");
                error.status = 400;
                throw error;
            }

            const refreshToken = jwt.sign({ id: user.id, role: user.role }, env.REFRESH_TOKEN, { expiresIn: "180s" });
            const accesshToken = jwt.sign({ id: user.id, role: user.role }, env.ACCESS_TOKEN, { expiresIn: "60s" });

            res.json({ refreshToken, accesshToken });

            const hashedRefreshToken = hashSync(refreshToken, 5);
            db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [hashedRefreshToken, user.id]);
        } catch (error) {
            res.status(error.status || 500).json({ message: "Login error: " + error.message });
        }
    }

    async refresh() {}

    async logout() {}
}

export default new AuthController();
