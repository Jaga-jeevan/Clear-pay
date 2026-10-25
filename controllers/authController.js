const User = require("../models/User");

const RefreshToken = require("../models/RefreshToken");


const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../services/tokenService");



const {
    createOTP,
    verifyOTP
} = require("../services/otpService");



const {
    sendWelcomeEmail,
    sendOTPEmail
} = require("../services/emailService");







// ==========================
// Save Refresh Token
// ==========================

const saveRefreshToken = async (

    userId,

    refreshToken,

    req

)=>{


    await RefreshToken.create({

        userId,

        token:refreshToken,


        deviceId:

        req.headers["user-agent"] || "unknown",


        deviceName:

        "Browser",


        ipAddress:

        req.ip,



        expiresAt:

        new Date(

            Date.now()

            +

            7 * 24 * 60 * 60 * 1000

        )


    });


};









// ==========================
// Generate Account Number
// ==========================


const generateAccountNumber = async()=>{


let accountNumber;



do{


accountNumber =

Math.floor(

100000000000 +

Math.random() * 900000000000

).toString();



}

while(

await User.findOne({

accountNumber

})

);



return accountNumber;



};











// ==========================
// Register User
// ==========================


exports.register = async(req,res)=>{


try{


const {

fullName,

email,

phone,

password

}=req.body;





const existingUser =

await User.findOne({

email:

email.toLowerCase()

});







if(existingUser){


return res.status(409).json({

success:false,

message:

"Email is already registered"

});


}







const accountNumber =

await generateAccountNumber();








const user =

await User.create({

fullName,


email:

email.toLowerCase(),


phone,


password,


accountNumber


});







const accessToken =

generateAccessToken(

user._id

);







const refreshToken =

generateRefreshToken(

user._id

);







await saveRefreshToken(

user._id,

refreshToken,

req

);







// Welcome Email

await sendWelcomeEmail(

user.email,

user.fullName

);







return res.status(201).json({

success:true,


message:

"Account created successfully",


accessToken,


refreshToken,



user:{


id:user._id,


fullName:user.fullName,


email:user.email,


phone:user.phone,


accountNumber:user.accountNumber,


balance:user.balance,


role:user.role



}


});





}

catch(error){


console.error(

"Register Error:",

error

);



return res.status(500).json({

success:false,

message:

"Internal Server Error"

});


}


};
// ==========================
// Login User
// ==========================

exports.login = async(req,res)=>{


try{


const {

email,

password

}=req.body;





const user =

await User.findOne({

email:

email.toLowerCase()

}).select("+password");






if(!user){


return res.status(401).json({

success:false,

message:

"Invalid email or password"

});


}







const isMatch =

await user.comparePassword(

password

);






if(!isMatch){


return res.status(401).json({

success:false,

message:

"Invalid email or password"

});


}







const accessToken =

generateAccessToken(

user._id

);







const refreshToken =

generateRefreshToken(

user._id

);







await saveRefreshToken(

user._id,

refreshToken,

req

);








return res.status(200).json({

success:true,


message:

"Login successful",



accessToken,


refreshToken,



user:{


id:user._id,


fullName:user.fullName,


email:user.email,


phone:user.phone,


accountNumber:user.accountNumber,


balance:user.balance,


role:user.role



}


});





}

catch(error){


console.error(

"Login Error:",

error

);



return res.status(500).json({

success:false,

message:

"Internal Server Error"

});


}


};









// ==========================
// Refresh Token
// ==========================

exports.refreshToken = async(req,res)=>{


try{


const {

refreshToken

}=req.body;







if(!refreshToken){


return res.status(400).json({

success:false,

message:

"Refresh token required"

});


}







const storedToken =

await RefreshToken.findOne({

token:refreshToken,

isRevoked:false

});







if(!storedToken){


return res.status(401).json({

success:false,

message:

"Invalid refresh token"

});


}







const decoded =

verifyRefreshToken(

refreshToken

);







const accessToken =

generateAccessToken(

decoded.userId

);







return res.status(200).json({

success:true,


accessToken


});





}

catch(error){


return res.status(401).json({

success:false,

message:

"Refresh token expired or invalid"

});


}


};









// ==========================
// Logout
// ==========================

exports.logout = async(req,res)=>{


try{


const {

refreshToken

}=req.body;







await RefreshToken.findOneAndUpdate(

{

token:refreshToken

},

{

isRevoked:true

}

);







return res.status(200).json({

success:true,

message:

"Logged out successfully"

});


}

catch(error){


return res.status(500).json({

success:false,

message:

"Logout failed"

});


}


};









// ==========================
// Logout All Devices
// ==========================

exports.logoutAll = async(req,res)=>{


try{


await RefreshToken.updateMany(

{

userId:req.userId

},

{

isRevoked:true

}

);







return res.status(200).json({

success:true,

message:

"Logged out from all devices"

});


}

catch(error){


return res.status(500).json({

success:false,

message:

"Logout all failed"

});


}


};









// ==========================
// Current User
// ==========================

exports.getMe = async(req,res)=>{


try{


const user =

await User.findById(

req.userId

);







if(!user){


return res.status(404).json({

success:false,

message:

"User not found"

});


}







return res.status(200).json({

success:true,

user


});


}

catch(error){


console.error(

"GetMe Error:",

error

);



return res.status(500).json({

success:false,

message:

"Internal Server Error"

});


}


};
// ==========================
// Forgot Password
// ==========================

exports.forgotPassword = async(req,res)=>{


try{


const {

email

}=req.body;






if(!email){


return res.status(400).json({

success:false,

message:

"Email is required"

});


}







const user =

await User.findOne({

email:

email.toLowerCase()

});







if(!user){


return res.status(404).json({

success:false,

message:

"User not found"

});


}








const otpRecord =

await createOTP(

email,

"RESET_PASSWORD",

user._id

);








await sendOTPEmail(

email,

otpRecord.otp

);







return res.status(200).json({

success:true,

message:

"Password reset OTP sent successfully"


});





}

catch(error){


console.error(

"Forgot Password Error:",

error

);




return res.status(500).json({

success:false,

message:

"Internal Server Error"

});


}


};









// ==========================
// Reset Password
// ==========================

exports.resetPassword = async(req,res)=>{


try{


const {

email,

otp,

newPassword

}=req.body;







if(

!email ||

!otp ||

!newPassword

){


return res.status(400).json({

success:false,

message:

"Email, OTP and new password are required"


});


}








const verified =

await verifyOTP(

email,

otp,

"RESET_PASSWORD"

);







if(!verified){


return res.status(400).json({

success:false,

message:

"Invalid or expired OTP"


});


}








const user =

await User.findOne({

email:

email.toLowerCase()

});







if(!user){


return res.status(404).json({

success:false,

message:

"User not found"


});


}







user.password =

newPassword;






await user.save();







return res.status(200).json({

success:true,

message:

"Password reset successfully"


});





}

catch(error){


console.error(

"Reset Password Error:",

error

);



return res.status(500).json({

success:false,

message:

"Internal Server Error"


});


}


};