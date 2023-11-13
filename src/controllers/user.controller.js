import userService from "../services/user.service.js";

const handleError = (res, error) => {
    res.status(500).json({
        message: error.message,
    });
};

class UserController {
    async create(req, res) {
        try {
            const result = await userService.add(req.body);
            res.status(201).json(result);
        } catch (error) {
            handleError(res, error);
        }
    }

    async findAll(req, res) {
        try {
            const limit = 5;
            const offset = (req.query.page - 1) * limit;

            const users = await userService.getAll(limit, offset);
            res.json(users);
        } catch (error) {
            handleError(res, error);
        }
    }

    async findByID(req, res) {
        try {
            const user = await userService.getByID(req.params.id);
            res.json(user);
        } catch (error) {
            handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const user = await userService.getByID(req.params.id);
            const newUser = { ...user, ...req.body };
            const result = await userService.update(req.params.id, newUser);

            res.status(201).json(result);
        } catch (error) {
            handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            const result = await userService.delete(req.params.id);

            res.json(result);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default new UserController();
