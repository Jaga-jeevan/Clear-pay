const OTP = require("../models/OTP");


const {
    createOTP,
    verifyOTP,
    getOTPStatus
} = require("../services/otpService");


const {
    sendOTPEmail
} = require("../services/emailService");






const ALLOWED_PURPOSES = [

    "REGISTER",

    "LOGIN",

    "TRANSACTION",

    "RESET_PASSWORD"

];








// ==========================
// Send OTP
// ==========================

exports.sendOTP = async(req,res)=>{


try{


const {

email,

purpose="REGISTER",

userId

}=req.body;





if(!email){


return res.status(400).json({

success:false,

message:"Email is required"

});


}





if(!ALLOWED_PURPOSES.includes(purpose)){


return res.status(400).json({

success:false,

message:"Invalid OTP purpose"

});


}







const otpRecord =

await createOTP(

email,

purpose,

userId

);






// Send OTP Email

await sendOTPEmail(

email,

otpRecord.otp

);






return res.status(200).json({

success:true,

message:"OTP sent successfully"

});





}

catch(error){


console.error(

"Send OTP Error:",

error

);



return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};









// ==========================
// Verify OTP
// ==========================

exports.verifyOTP = async(req,res)=>{


try{


const {

email,

otp,

purpose="REGISTER"

}=req.body;







if(!email || !otp){


return res.status(400).json({

success:false,

message:"Email and OTP required"

});


}







const verified =

await verifyOTP(

email,

otp,

purpose

);







if(!verified){


return res.status(400).json({

success:false,

message:"Invalid or expired OTP"

});


}







return res.status(200).json({

success:true,

message:"OTP verified successfully"

});





}

catch(error){


console.error(

"Verify OTP Error:",

error

);



return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};









// ==========================
// Resend OTP
// ==========================

exports.resendOTP = async(req,res)=>{


try{


const {

email,

purpose="REGISTER",

userId

}=req.body;







if(!email){


return res.status(400).json({

success:false,

message:"Email required"

});


}







if(!ALLOWED_PURPOSES.includes(purpose)){


return res.status(400).json({

success:false,

message:"Invalid OTP purpose"

});


}







const otpRecord =

await createOTP(

email,

purpose,

userId

);






await sendOTPEmail(

email,

otpRecord.otp

);






return res.status(200).json({

success:true,

message:"OTP resent successfully"

});





}

catch(error){


console.error(

"Resend OTP Error:",

error

);



return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};









// ==========================
// Delete OTP
// ==========================

exports.deleteOTP = async(req,res)=>{


try{


const {

email,

purpose="REGISTER"

}=req.body;






if(!email){


return res.status(400).json({

success:false,

message:"Email required"

});


}







await OTP.deleteMany({

email:

email.toLowerCase(),

purpose

});







return res.status(200).json({

success:true,

message:"OTP deleted successfully"

});





}

catch(error){


console.error(

"Delete OTP Error:",

error

);



return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};









// ==========================
// OTP Status
// ==========================

exports.checkOTPStatus = async(req,res)=>{


try{


const {

email,

purpose="REGISTER"

}=req.query;







if(!email){


return res.status(400).json({

success:false,

message:"Email required"

});


}







const otpRecord =

await getOTPStatus(

email,

purpose

);







if(!otpRecord){


return res.status(404).json({

success:false,

message:"No OTP found"

});


}







return res.status(200).json({

success:true,

expiresAt:

otpRecord.expiresAt,


verified:

otpRecord.verified

});





}

catch(error){


console.error(

"OTP Status Error:",

error

);



return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};