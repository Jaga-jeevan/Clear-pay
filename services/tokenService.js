const jwt = require("jsonwebtoken");


// ==========================
// Generate Access Token
// ==========================

const generateAccessToken = (userId) => {

    return jwt.sign(

        {
            userId,
        },

        process.env.JWT_ACCESS_SECRET ||
        process.env.JWT_SECRET,

        {
            expiresIn:
            process.env.ACCESS_TOKEN_EXPIRE || "15m"
        }

    );

};




// ==========================
// Generate Refresh Token
// ==========================

const generateRefreshToken = (userId) => {

    return jwt.sign(

        {
            userId,
            type:"refresh"
        },

        process.env.JWT_REFRESH_SECRET ||
        process.env.JWT_SECRET,

        {
            expiresIn:
            process.env.REFRESH_TOKEN_EXPIRE || "7d"
        }

    );

};




// ==========================
// Verify Access Token
// ==========================

const verifyAccessToken = (token) => {

    return jwt.verify(

        token,

        process.env.JWT_ACCESS_SECRET ||
        process.env.JWT_SECRET

    );

};




// ==========================
// Verify Refresh Token
// ==========================

const verifyRefreshToken = (token) => {

    return jwt.verify(

        token,

        process.env.JWT_REFRESH_SECRET ||
        process.env.JWT_SECRET

    );

};





module.exports = {

    generateAccessToken,

    generateRefreshToken,

    verifyAccessToken,

    verifyRefreshToken

};