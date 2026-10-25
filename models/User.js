const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// ==========================
// Device Schema
// ==========================
const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },

    deviceName: {
      type: String,
      trim: true,
      default: "Unknown Device",
    },

    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);


// ==========================
// User Schema
// ==========================
const UserSchema = new mongoose.Schema(
  {

    fullName: {

      type:String,

      required:true,

      trim:true,

      minlength:3,

      maxlength:50,

    },


    email: {

      type:String,

      required:true,

      unique:true,

      lowercase:true,

      trim:true,

      match:[
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Invalid email address"
      ]

    },


    phone: {

      type:String,

      required:true,

      unique:true,

      trim:true,

      match:[
        /^[6-9]\d{9}$/,
        "Invalid phone number"
      ]

    },


    password: {

      type:String,

      required:true,

      minlength:8,

      select:false,

    },


    accountNumber: {

      type:String,

      required:true,

      unique:true,

      trim:true,

      match:[
        /^\d{9,18}$/,
        "Invalid account number"
      ]

    },


    balance: {

      type:Number,

      default:50000,

      min:0,

    },


    profilePhoto: {

      type:String,

      default:"",

      trim:true,

    },


    address: {

      type:String,

      maxlength:200,

      default:"",

      trim:true,

    },


    occupation: {

      type:String,

      maxlength:100,

      default:"",

      trim:true,

    },


    dateOfBirth: {

      type:Date,

    },


    isEmailVerified: {

      type:Boolean,

      default:false,

    },


    isPhoneVerified: {

      type:Boolean,

      default:false,

    },


    isActive: {

      type:Boolean,

      default:true,

    },
    role: {

  type:String,

  enum:[
    "customer",
    "admin"
  ],

  default:"customer"

},


    devices: {

      type:[deviceSchema],

      default:[],

    },


  },

  {

    timestamps:true,

    versionKey:false,

  }

);


// ==========================
// Hash Password Before Save
// ==========================
UserSchema.pre("save", async function (next) {

  try {


    if (!this.isModified("password")) {

      return next();

    }



    const salt =
      await bcrypt.genSalt(10);



    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );



    next();



  } catch(error) {


    next(error);


  }

});




// ==========================
// Compare Password
// ==========================
UserSchema.methods.comparePassword =
async function(password){

  return bcrypt.compare(
    password,
    this.password
  );

};





// ==========================
// Add Trusted Device
// ==========================
UserSchema.methods.addDevice =
async function(
  deviceId,
  deviceName="Unknown Device"
){


  const existingDevice =
    this.devices.find(
      device =>
      device.deviceId === deviceId
    );



  if(existingDevice){


    existingDevice.lastUsed =
      new Date();


  }
  else{


    this.devices.push({

      deviceId,

      deviceName,

      lastUsed:new Date(),

    });


  }



  await this.save();


};





// ==========================
// Remove Trusted Device
// ==========================
UserSchema.methods.removeDevice =
async function(deviceId){


  this.devices =
    this.devices.filter(
      device =>
      device.deviceId !== deviceId
    );



  await this.save();


};





// ==========================
// Hide Password From Response
// ==========================
UserSchema.methods.toJSON =
function(){


  const user =
    this.toObject();



  delete user.password;



  return user;


};





module.exports =
mongoose.model(
  "User",
  UserSchema
);