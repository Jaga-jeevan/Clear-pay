require("dotenv").config();

const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{

    console.log("MongoDB Connection Successful");

    process.exit();

})
.catch((err)=>{

    console.log("MongoDB Error:");
    console.log(err.message);

    process.exit();

});