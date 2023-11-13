import { Request, Response } from "express";
import userService from "../services/user.service.js";

class UserController {
    async create(req: Request, res: Response) {
        try {
            const result = await userService.add(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async findAll(req: Request<any, any, any, IUserFindAllQuery>, res: Response) {
        try {
            if (req.query.page) {
                const limit = 5;
                const offset = (+req.query.page - 1) * limit;

                const users = await userService.getAll(limit, offset);
                res.json(users);
            }
        } catch (error: any) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async findByID(req: Request<IParamsID>, res: Response) {
        try {
            const user = await userService.getByID(req.params.id);

            if (!user) {
                const error = { ...new Error("User not found"), status: 404 } as IError;
                throw error;
            }

            res.json(user);
        } catch (error: any) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async update(req: Request<IParamsID>, res: Response) {
        try {
            const user = await userService.getByID(req.params.id);

            if (!user) {
                const error = { ...new Error("User not found"), status: 404 } as IError;
                throw error;
            }

            const newUser = { ...user, ...req.body };
            const result = await userService.update(req.params.id, newUser);

            res.status(201).json(result);
        } catch (error: any) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async delete(req: Request<IParamsID>, res: Response) {
        try {
            const result = await userService.delete(req.params.id);
            res.json(result);
        } catch (error: any) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
}

export default new UserController();
