import db from "../config/db.config.js";

class UserService {
    async add(user: IUser) {
        const sqlQuery = "INSERT INTO users (name, password, email, age) VALUES (?, ?, ?, ?)";
        const [result] = (await db.query(sqlQuery, [user.name, user.password, user.email, user.age])) as any;
        const lastInserted = await this.getByID(result.insertId);

        return {
            user: lastInserted,
            message: "User succesfully added",
        };
    }

    async getAll(limit: number, offset: number) {
        let sqlQuery;

        if (isNaN(offset)) {
            sqlQuery = "SELECT * FROM users";
        } else {
            sqlQuery = "SELECT * FROM users LIMIT ? OFFSET ?";
        }

        const [users] = await db.query(sqlQuery, [limit, offset]);
        return users;
    }

    async getByID(id: number) {
        const sqlQuery = "SELECT * FROM users WHERE id = ?";
        const [user] = (await db.query(sqlQuery, [id])) as any;

        return user[0];
    }

    async update(id: number, newUser: INewUser) {
        const sqlQuery = "UPDATE users SET name=?, password=?, email=?, age=? WHERE id = ?";
        await db.query(sqlQuery, [newUser.name, newUser.password, newUser.email, newUser.age, id]);

        return {
            newUser,
            message: "User succesfully updated",
        };
    }
    async delete(id: number) {
        const user = await this.getByID(id);

        if (!user) {
            const error = { ...new Error("User not found"), status: 404 } as IError;
            throw error;
        }

        const sqlQuery = "DELETE FROM users WHERE id = ?";
        await db.query(sqlQuery, [id]);

        return {
            message: "User succesfully deleted",
        };
    }
}

export default new UserService();
