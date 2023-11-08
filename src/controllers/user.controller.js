import db from "../config/db.config.js";

const handleError = (res, error) => {
	res.status(500).json({
		message: error.message,
	});
};

class UserController {
	async create(req, res) {
		try {
			const { name, password, email, age } = req.body;

			const query = "INSERT INTO users (name, password, email, age) VALUES (?, ?, ?, ?)";
			const [newUser] = await db.query(query, [name, password, email, age]);

			res.send(`User with id ${newUser.insertId} was succesfully created!`);
		} catch (error) {
			handleError(res, error);
		}
	}

	async findAll(req, res) {
		try {
			const query = "SELECT * FROM users";
			const [users] = await db.query(query, []);

			res.json(users);
		} catch (error) {
			handleError(res, error);
		}
	}

	async findByID(req, res) {
		try {
			const query = "SELECT * FROM users WHERE id = ?";
			const [user] = await db.query(query, [req.params.id]);

			res.json(user[0]);
		} catch (error) {
			handleError(res, error);
		}
	}

	async update(req, res) {
		try {
			const body = req.body;
			const [user] = (await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]))[0];
			const { name, password, email, age } = {
				...user,
				...body,
			};
			const query = "UPDATE users SET name = ?, password = ?, email = ?, age = ? WHERE id = ?";
			await db.query(query, [name, password, email, age, req.params.id]);

			res.send(`User with id ${req.params.id} was succesfully updated!`);
		} catch (error) {
			handleError(res, error);
		}
	}

	async delete(req, res) {
		try {
			const query = "DELETE FROM users WHERE id = ?";
			await db.query(query, [req.params.id]);

			res.send(`User with id ${req.params.id} was succesfully deleted!`);
		} catch (error) {
			handleError(res, error);
		}
	}
}

export default new UserController();
