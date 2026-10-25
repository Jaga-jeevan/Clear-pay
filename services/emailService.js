const nodemailer = require("nodemailer");




// ==========================
// Email Transporter
// ==========================

const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port: process.env.EMAIL_PORT,

    secure:false,

    auth:{

        user:process.env.EMAIL_USER,

        pass:process.env.EMAIL_PASSWORD

    }

});







// ==========================
// Send Email
// ==========================

const sendEmail = async({

    to,

    subject,

    html

})=>{


    try{


        await transporter.sendMail({

            from:
            `"NexusBank Security" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html

        });



        console.log(
            "Email sent successfully:",
            to
        );



    }
    catch(error){


        console.error(

            "Email Error:",

            error

        );


        throw error;


    }


};









// ==========================
// OTP Email
// ==========================

const sendOTPEmail = async(

    email,

    otp

)=>{


    return sendEmail({

        to:email,


        subject:
        "NexusBank OTP Verification",


        html:`


        <div style="
        font-family:Arial;
        padding:20px;
        ">


        <h2>
        NexusBank Security Verification
        </h2>


        <p>
        Your OTP is:
        </p>


        <h1>
        ${otp}
        </h1>


        <p>
        This OTP will expire in 5 minutes.
        </p>


        <p>
        Do not share this OTP with anyone.
        </p>


        </div>


        `

    });


};









// ==========================
// Welcome Email
// ==========================

const sendWelcomeEmail = async(

    email,

    name

)=>{


    return sendEmail({

        to:email,


        subject:
        "Welcome to NexusBank",



        html:`


        <h2>
        Welcome ${name} 🎉
        </h2>


        <p>
        Your NexusBank account has been created successfully.
        </p>


        <p>
        Thank you for choosing secure digital banking.
        </p>


        `

    });


};









// ==========================
// Transaction Alert Email
// ==========================

const sendTransactionEmail = async(

    email,

    amount,

    status

)=>{


    return sendEmail({

        to:email,


        subject:
        "NexusBank Transaction Alert",



        html:`


        <h2>
        Transaction Update
        </h2>


        <p>
        Amount: $${amount}
        </p>


        <p>
        Status: ${status}
        </p>


        <p>
        If this was not you, contact NexusBank security.
        </p>


        `

    });


};







module.exports = {


    sendEmail,

    sendOTPEmail,

    sendWelcomeEmail,

    sendTransactionEmail


};