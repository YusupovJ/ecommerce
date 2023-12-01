const apiResponse = (res) => {
    return {
        send(data, pagination, status = 200) {
            let response = {
                data,
                pagination: pagination || null,
                error: null,
                date: new Date(),
            };

            res.status(status).json(response);
        },
        error(message, status = 500) {
            let response = {
                data: null,
                error: message,
                pagination: null,
                date: new Date(),
            };
            res.status(status).json(response);
        },
    };
};

export default apiResponse;
