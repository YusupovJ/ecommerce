import db from "../config/db.config.js";
import apiResponse from "../helpers/apiResponse.js";
import Pagination from "../helpers/pagination.js";

class ProductController {
	async createProduct() {}

	async getAll(req, res) {
		try {
			const { page, limit } = req.query;

			const [[count]] = await db.query("SELECT COUNT(id) FROM products");
			const length = count["COUNT(id)"];

			const pagination = new Pagination(+page, +limit, length);

			let sqlQuery = "SELECT * FROM products LIMIT ? OFFSET ?";
			const [products] = await db.query(sqlQuery, [pagination.limit, pagination.offset()]);

			apiResponse(res).send(products, pagination);
		} catch (error) {
			apiResponse(res).error(error.message, error.status);
		}
	}
}

export default new ProductController();
