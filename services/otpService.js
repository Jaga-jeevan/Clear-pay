const OTP = require("../models/OTP");




// ==========================
// Generate 6 Digit OTP
// ==========================

const generateOTP = ()=>{


    return Math.floor(

        100000 +

        Math.random() * 900000

    ).toString();


};







// ==========================
// Create OTP
// ==========================

const createOTP = async(

    email,

    purpose="REGISTER",

    userId=null

)=>{


    try{


        await OTP.deleteMany({

            email:
            email.toLowerCase(),

            purpose

        });





        const otp =
        generateOTP();





        const expiresAt =

        new Date(

            Date.now() +

            5 * 60 * 1000

        );






        const otpRecord =

        await OTP.create({

            userId,

            email:
            email.toLowerCase(),

            otp,

            purpose,

            expiresAt


        });






        return otpRecord;



    }

    catch(error){


        throw error;


    }


};









// ==========================
// Verify OTP
// ==========================

const verifyOTP = async(

    email,

    otp,

    purpose

)=>{


    const otpRecord =

    await OTP.findOne({

        email:
        email.toLowerCase(),

        purpose,

        verified:false


    });






    if(!otpRecord){

        return false;

    }






    if(

        otpRecord.expiresAt < new Date()

    ){

        return false;

    }







    // Wrong OTP Attempt

    if(

        otpRecord.otp !== otp

    ){


        otpRecord.attempts += 1;



        await otpRecord.save();




        if(

            otpRecord.attempts >= 5

        ){

            await OTP.deleteOne({

                _id:
                otpRecord._id

            });

        }



        return false;


    }







    otpRecord.verified = true;



    await otpRecord.save();




    return true;



};









// ==========================
// Get OTP Status
// ==========================

const getOTPStatus = async(

    email,

    purpose

)=>{


    return await OTP.findOne({

        email:
        email.toLowerCase(),

        purpose


    })

    .sort({

        createdAt:-1

    });



};








module.exports = {


    createOTP,

    verifyOTP,

    getOTPStatus


};