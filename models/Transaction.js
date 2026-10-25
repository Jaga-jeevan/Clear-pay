const mongoose = require("mongoose");


const TransactionSchema = new mongoose.Schema(

  {

    transactionId: {

      type:String,

      required:true,

      unique:true,

      trim:true,

    },


    userId: {

      type:mongoose.Schema.Types.ObjectId,

      ref:"User",

      required:true,

    },


    type: {

      type:String,

      enum:[
        "DEBIT",
        "CREDIT"
      ],

      required:true,

    },


    amount: {

      type:Number,

      required:true,

      min:1,

    },


    currency: {

      type:String,

      default:"INR",

    },


    beneficiaryId: {

      type:mongoose.Schema.Types.ObjectId,

      ref:"Beneficiary",

    },


    beneficiaryName: {

      type:String,

      trim:true,

    },


    fromAccount: {

      type:String,

      required:true,

    },


    toAccount: {

      type:String,

      required:true,

    },


    remarks: {

      type:String,

      trim:true,

      maxlength:200,

    },


    status: {

      type:String,

      enum:[

        "PENDING",

        "COMPLETED",

        "FAILED",

        "BLOCKED",

        "VERIFICATION_REQUIRED"

      ],

      default:"PENDING",

    },


    fraudScore: {

      type:Number,

      default:0,

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

      default:"LOW",

    },


    fraudReasons:[

      {

        type:String,

      }

    ],


    deviceId: {

      type:String,

      trim:true,

    },

  },


  {

    timestamps:true,

    versionKey:false,

  }

);
// ==========================
// Compound Indexes
// ==========================

TransactionSchema.index({
  userId: 1,
  createdAt: -1,
});



// ==========================
// Export Model
// ==========================

module.exports =
mongoose.model(
  "Transaction",
  TransactionSchema
);