const apiResponse = (res) => {
	return {
		send(data, pagination) {
			let response = {
				data,
				error: null,
			};

			if (pagination) {
				response.totalPage = pagination.totalPages();
				response.currentPage = pagination.page;
			}

			res.json(response);
		},
		error(message, status = 500) {
			res.status(status).json({ data: null, error: message });
		},
	};
};

export default apiResponse;
