const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");


const errorHandler = (
    err,
    req,
    res,
    next
) => {


    logger.error({

        message: err.message,

        method: req.method,

        url: req.originalUrl,

        ip: req.ip,

        stack: err.stack

    });



    let error = err;



    if (!(error instanceof ApiError)) {

        error = new ApiError(

            res.statusCode !== 200
                ? res.statusCode
                : 500,

            error.message ||
            "Internal Server Error"

        );

    }



    return res.status(error.statusCode).json({

        success:false,

        message:error.message,

        errors:error.errors || [],

        stack:
        process.env.NODE_ENV === "development"
        ? error.stack
        : undefined

    });


};


module.exports = errorHandler;