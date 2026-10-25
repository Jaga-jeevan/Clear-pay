const Transaction = require("../models/Transaction");

const Beneficiary = require("../models/Beneficiary");

const FraudLog = require("../models/FraudLog");

const User = require("../models/User");



const {
    calculateFraudScore
} = require("../services/fraudScoringService");



const {
    generateStatementPDF
} = require("../services/pdfService");



const {
    sendTransactionEmail
} = require("../services/emailService");








// ==========================
// Generate Transaction ID
// ==========================

const generateTransactionId = () => {


    const date =

    new Date()

    .toISOString()

    .slice(0,10)

    .replace(/-/g,"");



    const random =

    Math.floor(

        100000 +

        Math.random() * 900000

    );



    return `TXN-${date}-${random}`;


};








// ==========================
// Check Fraud
// ==========================

exports.checkFraud = async(req,res)=>{


try{


const {

beneficiaryId,

amount,

deviceId


}=req.body;





if(!beneficiaryId){


return res.status(400).json({

success:false,

message:"Beneficiary is required"

});


}







if(!amount || amount <=0){


return res.status(400).json({

success:false,

message:"Enter valid amount"

});


}








const beneficiary =

await Beneficiary.findOne({

_id:beneficiaryId,

userId:req.userId

});







if(!beneficiary){


return res.status(404).json({

success:false,

message:"Beneficiary not found"

});


}







const fraudResult =

await calculateFraudScore(

req.userId,

{

beneficiaryId,

amount,

deviceId

}

);








return res.status(200).json({

success:true,

fraudResult

});




}
catch(error){


console.error(

"Check Fraud Error:",

error

);



return res.status(500).json({

success:false,

message:"Fraud check failed"

});


}


};
// ==========================
// Execute Transfer
// ==========================

exports.transfer = async(req,res)=>{


try{


const {

beneficiaryId,

amount,

deviceId,

remarks=""

}=req.body;





if(!beneficiaryId){


return res.status(400).json({

success:false,

message:"Beneficiary is required"

});


}







if(!amount || amount <=0){


return res.status(400).json({

success:false,

message:"Enter valid amount"

});


}









// ==========================
// Find User
// ==========================


const user =

await User.findById(

req.userId

);







if(!user){


return res.status(404).json({

success:false,

message:"User not found"

});


}









// ==========================
// Find Beneficiary
// ==========================


const beneficiary =

await Beneficiary.findOne({

_id:beneficiaryId,

userId:req.userId

});







if(!beneficiary){


return res.status(404).json({

success:false,

message:"Beneficiary not found"

});


}









// ==========================
// Balance Check
// ==========================


if(user.balance < amount){


return res.status(400).json({

success:false,

message:"Insufficient balance"

});


}









// ==========================
// Fraud Analysis
// ==========================


const fraudResult =

await calculateFraudScore(

req.userId,

{

beneficiaryId,

amount,

deviceId

}

);









let status = "completed";

let action = "allowed";






if(
fraudResult.riskLevel === "HIGH"
){


status = "blocked";

action = "blocked";


}

else if(
fraudResult.riskLevel === "MEDIUM"
){


status = "verification_required";

action = "verification_required";


}









// ==========================
// Create Transaction
// ==========================


const transaction =

await Transaction.create({

transactionId:

generateTransactionId(),



userId:req.userId,



type:"debit",



amount:Number(amount),



currency:"INR",



beneficiaryId,



beneficiaryName:

beneficiary.name,



fromAccount:

user.accountNumber,



toAccount:

beneficiary.accountNumber,



remarks,



status,



fraudScore:

fraudResult.fraudScore,



riskLevel:

fraudResult.riskLevel,



fraudReasons:

fraudResult.fraudReasons,



deviceId


});









// ==========================
// Deduct Balance
// ==========================


if(status==="completed"){


user.balance -= Number(amount);


await user.save();


}









// ==========================
// Save Fraud Log
// ==========================


await FraudLog.create({

transactionId:

transaction._id,



userId:req.userId,



fraudScore:

fraudResult.fraudScore,



riskLevel:

fraudResult.riskLevel,



fraudReasons:

fraudResult.fraudReasons,



mlFeatures:

fraudResult.mlFeatures,



action


});









// ==========================
// Transaction Email Alert
// ==========================


try{


await sendTransactionEmail(

    user.email,

    amount,

    status

);


}

catch(emailError){


console.error(

"Transaction Email Failed:",

emailError.message

);


}









return res.status(200).json({

success:true,


message:


status==="completed"


?


"Transfer completed successfully"



:


status==="blocked"


?


"Transaction blocked due to high fraud risk"



:


"Verification required before completing transaction",





transaction,



fraudResult,



currentBalance:user.balance



});






}
catch(error){


console.error(

"Transfer Error:",

error

);



return res.status(500).json({

success:false,

message:"Transfer failed"

});


}


};
// ==========================
// Get Transaction History
// ==========================


exports.getTransactions = async(req,res)=>{


try{


const page =

Number(req.query.page) || 1;



const limit =

Number(req.query.limit) || 10;



const skip =

(page - 1) * limit;






const filter = {


    userId:req.userId


};







if(req.query.status){


filter.status =

req.query.status;


}







if(req.query.riskLevel){


filter.riskLevel =

req.query.riskLevel;


}









const totalTransactions =

await Transaction.countDocuments(

filter

);









const transactions =

await Transaction.find(

filter

)



.populate(

"beneficiaryId",

"name accountNumber bankName ifscCode"

)



.sort({

createdAt:-1

})



.skip(skip)



.limit(limit);









return res.status(200).json({

success:true,



currentPage:page,



totalPages:

Math.ceil(

totalTransactions / limit

),





totalTransactions,



transactions



});





}
catch(error){


console.error(

"Get Transactions Error:",

error

);




return res.status(500).json({

success:false,

message:

"Unable to fetch transactions"

});


}


};












// ==========================
// Get Fraud Alerts
// ==========================


exports.getAlerts = async(req,res)=>{


try{



const alerts =

await Transaction.find({


userId:req.userId,


status:{


$in:[

"blocked",

"verification_required"

]


}


})



.populate(

"beneficiaryId",

"name accountNumber bankName"

)



.sort({

createdAt:-1

});









const summary = {


totalAlerts:

alerts.length,



blocked:

alerts.filter(

(t)=>

t.status==="blocked"

).length,





verificationRequired:

alerts.filter(

(t)=>

t.status==="verification_required"

).length,





highRisk:

alerts.filter(

(t)=>

t.riskLevel==="HIGH"

).length,





mediumRisk:

alerts.filter(

(t)=>

t.riskLevel==="MEDIUM"

).length



};









return res.status(200).json({


success:true,


summary,


alerts



});





}
catch(error){


console.error(

"Get Alerts Error:",

error

);



return res.status(500).json({

success:false,

message:

"Unable to fetch fraud alerts"

});


}


};
// ==========================
// Download Bank Statement PDF
// ==========================


exports.downloadStatement = async(req,res)=>{


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







const transactions =

await Transaction.find({

userId:req.userId

})

.sort({

createdAt:-1

});







generateStatementPDF(

    user,

    transactions,

    res

);





}
catch(error){


console.error(

"Statement PDF Error:",

error

);




return res.status(500).json({

success:false,

message:

"Unable to generate statement"

});


}


};