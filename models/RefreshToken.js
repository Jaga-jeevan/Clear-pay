const mongoose = require("mongoose");


const RefreshTokenSchema = new mongoose.Schema(

    {

        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true,

        },


        token: {

            type: String,

            required: true,

            unique: true,

        },


        deviceId: {

            type: String,

            default: "unknown",

        },


        deviceName: {

            type: String,

            default: "Unknown Device",

        },


        ipAddress: {

            type: String,

            default: "",

        },


        expiresAt: {

            type: Date,

            required: true,

        },


        isRevoked: {

            type: Boolean,

            default: false,

        },


    },

    {

        timestamps:true,

        versionKey:false,

    }

);



// Auto delete expired tokens
RefreshTokenSchema.index(
    {
        expiresAt:1
    },
    {
        expireAfterSeconds:0
    }
);



module.exports =
mongoose.model(
    "RefreshToken",
    RefreshTokenSchema
);