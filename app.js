const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");
const os = require("os");


// Swagger
const {
    swaggerUi,
    swaggerSpec
} = require("./config/swagger");


// Routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const otpRoutes = require("./routes/otpRoutes");
const settingsRoutes = require("./routes/settingsRoutes");


// Middleware
const notFound = require("./middleware/notfound");
const errorHandler = require("./middleware/errorhandler");

const {
    apiLimiter
} = require("./middleware/rateLimiter");





// ==========================
// Initialize App
// ==========================

const app = express();





// ==========================
// Security Middleware
// ==========================


app.use(

    helmet({

        crossOriginResourcePolicy:false,

        contentSecurityPolicy:false

    })

);





app.use(

    cors({

        origin:

        process.env.CLIENT_URL ||

        "http://localhost:3000",


        credentials:true,


        methods:[

            "GET",

            "POST",

            "PUT",

            "DELETE"

        ],


        allowedHeaders:[

            "Content-Type",

            "Authorization"

        ]

    })

);






app.use(

    express.json({

        limit:"1mb"

    })

);






app.use(

    express.urlencoded({

        extended:true,

        limit:"1mb"

    })

);






app.use(cookieParser());



app.use(compression());



app.use(mongoSanitize());



app.use(xss());



app.use(hpp());




// Global API limiter

app.use(apiLimiter);







// Development Logger

if(process.env.NODE_ENV !== "production"){

    app.use(
        morgan("dev")
    );

}








// ==========================
// Swagger Documentation
// ==========================


app.use(

    "/api-docs",

    swaggerUi.serve,

    swaggerUi.setup(swaggerSpec)

);

// ==========================
// Favicon Ignore
// ==========================

app.get("/favicon.ico",(req,res)=>{

    res.status(204).end();

});









// ==========================
// Routes
// ==========================


app.get("/",(req,res)=>{


    res.json({

        success:true,

        message:"NexusBank API Running"

    });


});






app.use(

    "/api/auth",

    authRoutes

);




app.use(

    "/api/otp",

    otpRoutes

);




app.use(

    "/api/profile",

    profileRoutes

);




app.use(

    "/api/settings",

    settingsRoutes

);




app.use(

    "/api/transactions",

    transactionRoutes

);




app.use(

    "/api/beneficiaries",

    beneficiaryRoutes

);




app.use(

    "/api/admin",

    adminRoutes

);









// ==========================
// Health Check
// ==========================


app.get(

"/api/health",

(req,res)=>{


const memoryUsage =

process.memoryUsage();



res.status(200).json({


    success:true,


    server:"running",


    service:"NexusBank API",


    version:"2.0.0",


    environment:

    process.env.NODE_ENV || "development",



    uptime:

    `${Math.floor(process.uptime())} seconds`,




    memory:{


        used:

        `${Math.round(
            memoryUsage.heapUsed / 1024 / 1024
        )} MB`,



        total:

        `${Math.round(
            memoryUsage.heapTotal / 1024 / 1024
        )} MB`


    },





    system:{


        platform:

        os.platform(),



        cpu:

        os.cpus().length


    },





    timestamp:

    new Date()


});


}

);









// ==========================
// Error Handling
// ==========================


app.use(notFound);


app.use(errorHandler);







module.exports = app;