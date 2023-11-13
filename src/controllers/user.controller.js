import userService from "../services/user.service.js";

class UserController {
    async create(req, res) {
        try {
            const result = await userService.add(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const limit = 5;
            const offset = (req.query.page - 1) * limit;

            const users = await userService.getAll(limit, offset);
            res.json(users);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async findByID(req, res) {
        try {
            const user = await userService.getByID(req.params.id);

            if (!user) {
                const error = new Error("User not found");
                error.status = 404;
                throw error;
            }

            res.json(user);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const user = await userService.getByID(req.params.id);

            if (!user) {
                const error = new Error("User not found");
                error.status = 404;
                throw error;
            }

            const newUser = { ...user, ...req.body };
            const result = await userService.update(req.params.id, newUser);

            res.status(201).json(result);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const result = await userService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
}

export default new UserController();
