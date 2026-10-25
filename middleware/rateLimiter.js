const rateLimit = require("express-rate-limit");




// ==========================
// Global API Limiter
// ==========================

const apiLimiter = rateLimit({

    windowMs:
    15 * 60 * 1000,


    max:
    100,


    standardHeaders:true,


    legacyHeaders:false,


    message:{

        success:false,

        message:
        "Too many requests. Please try again later."

    }

});







// ==========================
// Login Limiter
// ==========================

const loginLimiter = rateLimit({

    windowMs:
    15 * 60 * 1000,


    max:
    5,


    standardHeaders:true,


    legacyHeaders:false,


    skipSuccessfulRequests:true,


    message:{

        success:false,

        message:
        "Too many login attempts. Please try again after 15 minutes."

    }

});







// ==========================
// Register Limiter
// ==========================

const registerLimiter = rateLimit({

    windowMs:
    60 * 60 * 1000,


    max:
    10,


    standardHeaders:true,


    legacyHeaders:false,


    message:{

        success:false,

        message:
        "Too many registration attempts. Please try later."

    }

});







// ==========================
// OTP Limiter
// ==========================

const otpLimiter = rateLimit({

    windowMs:
    10 * 60 * 1000,


    max:
    5,


    standardHeaders:true,


    legacyHeaders:false,


    message:{

        success:false,

        message:
        "Too many OTP requests. Please wait."

    }

});







// ==========================
// Fraud Check Limiter
// ==========================

const fraudLimiter = rateLimit({

    windowMs:
    60 * 1000,


    max:
    30,


    standardHeaders:true,


    legacyHeaders:false,


    message:{

        success:false,

        message:
        "Fraud analysis request limit exceeded."

    }

});






module.exports = {

    apiLimiter,

    loginLimiter,

    registerLimiter,

    otpLimiter,

    fraudLimiter

};