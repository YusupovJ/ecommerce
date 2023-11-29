const roleGuard = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.role)) {
                const error = new Error("You don't have an access to this route");
                error.status = 403;
                throw error;
            }

            next();
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    };
};

export default roleGuard;
