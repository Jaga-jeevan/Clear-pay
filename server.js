require("dotenv").config();


const dns = require("dns");


// Fix MongoDB Atlas SRV DNS issue
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);



const app = require("./app");

const connectDB = require("./config/db");



const PORT = process.env.PORT || 5000;





// ==========================
// Start Server
// ==========================

const startServer = async () => {

    try {


        await connectDB();



        app.listen(PORT, () => {


            console.log(`

===========================================
🚀 NexusBank Backend Started Successfully
===========================================

Environment : ${process.env.NODE_ENV || "development"}

Server      : http://localhost:${PORT}

Health API  : http://localhost:${PORT}/api/health

===========================================

            `);


        });



    } catch(error){


        console.error(
            "Server Startup Failed:",
            error.message
        );


        process.exit(1);


    }


};



startServer();