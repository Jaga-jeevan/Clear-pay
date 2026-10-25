const mongoose = require("mongoose");


const OtpSchema = new mongoose.Schema(

{

    userId:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:false

    },



    email:{

        type:String,

        required:true,

        lowercase:true,

        trim:true,

        index:true

    },



    otp:{

        type:String,

        required:true

    },



    purpose:{

        type:String,

        enum:[

            "REGISTER",

            "LOGIN",

            "TRANSACTION",

            "RESET_PASSWORD"

        ],

        default:"REGISTER"

    },



    attempts:{

        type:Number,

        default:0

    },



    verified:{

        type:Boolean,

        default:false

    },



    expiresAt:{

        type:Date,

        required:true,

        index:{

            expires:0

        }

    }


},


{

    timestamps:true,

    versionKey:false

}


);





module.exports =
mongoose.model(
    "Otp",
    OtpSchema
);