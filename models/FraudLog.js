const mongoose = require("mongoose");


const FraudLogSchema = new mongoose.Schema(

  {

    transactionId: {

      type:mongoose.Schema.Types.ObjectId,

      ref:"Transaction",

      required:true,

    },


    userId: {

      type:mongoose.Schema.Types.ObjectId,

      ref:"User",

      required:true,

    },


    fraudScore: {

      type:Number,

      required:true,

      min:0,

      max:100,

    },


    riskLevel: {

      type:String,

      enum:[
        "LOW",
        "MEDIUM",
        "HIGH"
      ],

      required:true,

    },


    fraudReasons:[

      {

        type:String,

      }

    ],



    mlFeatures:{


      amountRatio:{

        type:Number,

        default:0,

      },


      timeAnomaly:{

        type:Number,

        default:0,

      },


      velocityScore:{

        type:Number,

        default:0,

      },


      newBeneficiaryFlag:{

        type:Number,

        default:0,

      },


      deviceTrustScore:{

        type:Number,

        default:0,

      },


    },



    action:{

      type:String,

      enum:[

        "ALLOWED",

        "BLOCKED",

        "VERIFICATION_REQUIRED",

        "UNDER_REVIEW"

      ],

      default:"ALLOWED",

    },


    adminAction:{

      type:String,

      enum:[

        "APPROVED",

        "REJECTED",

        "PENDING"

      ],

      default:"PENDING",

    },


  },


  {

    timestamps:true,

    versionKey:false,

  }

);
// ==========================
// Indexes
// ==========================

// Fraud dashboard aur admin filtering ke liye useful
FraudLogSchema.index({
  createdAt: -1
});


// ==========================
// Export Model
// ==========================

module.exports =
mongoose.model(
  "FraudLog",
  FraudLogSchema
);