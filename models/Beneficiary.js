const mongoose = require("mongoose");


const BeneficiarySchema = new mongoose.Schema(

  {

    userId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },


    name: {

      type:String,

      required:true,

      trim:true,

      minlength:3,

      maxlength:50,

    },


    accountNumber: {

      type:String,

      required:true,

      trim:true,

      match:[
        /^\d{9,18}$/,
        "Invalid account number"
      ],

    },


    bankName: {

      type:String,

      required:true,

      trim:true,

      maxlength:100,

    },


    ifscCode: {

      type:String,

      required:true,

      uppercase:true,

      trim:true,

      match:[
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Invalid IFSC Code"
      ],

    },


  },


  {

    timestamps:true,

    versionKey:false,

  }

);




// Unique beneficiary per user

BeneficiarySchema.index(
  {
    userId:1,
    accountNumber:1
  },
  {
    unique:true
  }
);



module.exports =
mongoose.model(
  "Beneficiary",
  BeneficiarySchema
);
