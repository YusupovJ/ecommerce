import db from "../config/db.config.js";
import Pagination from "../helpers/pagination.js";

class ProductController {
    async createProduct(req, res) {
        res.json({
            id: req.id,
            role: req.role,
            url: req.originalUrl,
        });
    }

    async getAll(req, res) {
        try {
            const { page, limit } = req.query;

            const [[count]] = await db.query("SELECT COUNT(id) FROM products");
            const length = count["COUNT(id)"];

            const pagination = new Pagination(+page, +limit, length);

            let sqlQuery = "SELECT * FROM products LIMIT ? OFFSET ?";
            const [products] = await db.query(sqlQuery, [pagination.limit, pagination.offset()]);

            res.json({ products, totalPages: pagination.totalPages(), currentPage: pagination.page });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
}

export default new ProductController();
