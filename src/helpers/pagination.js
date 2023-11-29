class Pagination {
    constructor(page, limit, length) {
        this.limit = limit || 10;
        this.page = page || 1;
        this.length = length;
    }

    offset() {
        return (this.page - 1) * this.limit;
    }

    totalPages() {
        return Math.ceil(this.length / this.limit);
    }
}

export default Pagination;
