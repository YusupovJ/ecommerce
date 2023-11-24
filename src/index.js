import express from "express";
import env from "./config/env.config.js";
import db from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
import roleGuard from "./middleware/role.guard.js";

const app = express();
const port = env.PORT;

app.use(express.json());
app.use("/auth", authRouter);

app.get("/products", roleGuard("admin"), (req, res) => {
    res.send("Hello world!");
});

app.listen(port, async () => {
    await db.connect();

    console.log(`Server was started on port ${port}`);
});
