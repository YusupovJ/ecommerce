class Pagination {
    constructor(page, limit, totalItems) {
        this.limit = limit || 10;
        this.page = page || 1;
        this.totalItems = totalItems;
        this.offset = (this.page - 1) * this.limit;
        this.totalPages = Math.ceil(this.length / this.limit);
    }
}

export default Pagination;
