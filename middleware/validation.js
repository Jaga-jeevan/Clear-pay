const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errorCount: errors.array({ onlyFirstError: true }).length,
            errors: errors.array({ onlyFirstError: true }).map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

module.exports = validate;