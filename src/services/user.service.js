import db from "../config/db.config.js";

class UserService {
    async getLastInserted() {
        const sqlQuery = "SELECT * FROM users WHERE id = LAST_INSERT_ID()";
        const [user] = await db.query(sqlQuery);

        return user[0];
    }

    async add(user) {
        const sqlQuery = "INSERT INTO users (name, password, email, age) VALUES (?, ?, ?, ?)";
        await db.query(sqlQuery, [user.name, user.password, user.email, user.age]);
        const lastInserted = await this.getLastInserted();

        return {
            user: lastInserted,
            message: "User succesfully added",
        };
    }

    async getAll() {
        const sqlQuery = "SELECT * FROM users";
        const [users] = await db.query(sqlQuery);

        return users;
    }

    async getByID(id) {
        const sqlQuery = "SELECT * FROM users WHERE id = ?";
        const [user] = await db.query(sqlQuery, [id]);

        return user[0];
    }

    async update(id, newUser) {
        const sqlQuery = "UPDATE users SET name=?, password=?, email=?, age=? WHERE id = ?";
        await db.query(sqlQuery, [newUser.name, newUser.password, newUser.email, newUser.age, id]);

        return {
            newUser,
            message: "User succesfully updated",
        };
    }
    async delete(id) {
        const sqlQuery = "DELETE FROM users WHERE id = ?";
        await db.query(sqlQuery, [id]);

        return {
            message: "User succesfully deleted",
        };
    }
}

export default new UserService();