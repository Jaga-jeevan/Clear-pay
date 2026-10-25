const Transaction = require("../models/Transaction");

const Beneficiary = require("../models/Beneficiary");

const User = require("../models/User");

const FraudLog = require("../models/FraudLog");




// ==========================
// Fraud Rule Weights
// ==========================

const FRAUD_RULES = {


NEW_BENEFICIARY:30,


HIGH_AMOUNT:25,


HIGH_VELOCITY:20,


UNUSUAL_TIME:15,


NEW_DEVICE:10,


FRAUD_HISTORY:20,


ABNORMAL_BEHAVIOUR:20


};






// ==========================
// Risk Levels
// ==========================

const RISK_LEVEL = {

LOW:"LOW",

MEDIUM:"MEDIUM",

HIGH:"HIGH"

};








// ==========================
// Main Fraud Engine
// ==========================

const calculateFraudScore = async(


userId,


transactionData


)=>{


let fraudScore = 0;


const fraudReasons=[];


const mlFeatures={};





if(

!transactionData.amount ||

transactionData.amount <=0

){

throw new Error(
"Invalid transaction amount"
);

}





// ==========================
// 1. New Beneficiary
// ==========================


const isNewBeneficiary =

await checkNewBeneficiary(

userId,

transactionData.beneficiaryId

);



mlFeatures.newBeneficiaryFlag =

isNewBeneficiary ? 1 : 0;





if(isNewBeneficiary){


fraudScore +=

FRAUD_RULES.NEW_BENEFICIARY;



fraudReasons.push(

"New beneficiary detected"

);


}








// ==========================
// 2. Amount Behaviour
// ==========================


const amountAnalysis =

await checkUserAmountBehaviour(

userId,

transactionData.amount

);



mlFeatures.amountRatio =

amountAnalysis.ratio;




if(amountAnalysis.isAbnormal){


fraudScore +=

FRAUD_RULES.HIGH_AMOUNT;



fraudReasons.push(

"Transaction amount is unusual compared to user history"

);


}
// ==========================
// 3. Transaction Velocity
// ==========================


const velocity =

await checkTransactionVelocity(

userId

);



mlFeatures.velocityScore = velocity;



if(velocity >= 3){


fraudScore +=

FRAUD_RULES.HIGH_VELOCITY;



fraudReasons.push(

"High transaction frequency detected"

);


}









// ==========================
// 4. Unusual Time Detection
// ==========================


const unusualTime =

checkUnusualTime();



mlFeatures.timeAnomaly =

unusualTime ? 1 : 0;





if(unusualTime){


fraudScore +=

FRAUD_RULES.UNUSUAL_TIME;



fraudReasons.push(

"Transaction attempted during unusual hours"

);


}









// ==========================
// 5. Device Trust Analysis
// ==========================


const isNewDevice =

await checkNewDevice(

userId,

transactionData.deviceId

);





mlFeatures.deviceTrustScore =

isNewDevice ? 0.3 : 0.9;





if(isNewDevice){


fraudScore +=

FRAUD_RULES.NEW_DEVICE;



fraudReasons.push(

"New device detected"

);


}









// ==========================
// 6. Previous Fraud History
// ==========================


const fraudHistory =

await checkFraudHistory(

userId

);




mlFeatures.previousFraudCount =

fraudHistory;





if(fraudHistory > 0){


fraudScore +=

FRAUD_RULES.FRAUD_HISTORY;



fraudReasons.push(

"Previous suspicious transactions found"

);


}









// ==========================
// 7. Beneficiary Behaviour
// ==========================


const beneficiaryRisk =

await checkBeneficiaryHistory(

userId,

transactionData.beneficiaryId

);




mlFeatures.beneficiaryTransactionCount =

beneficiaryRisk;





if(

beneficiaryRisk === 0

){


fraudScore += 10;



fraudReasons.push(

"No previous transaction with beneficiary"

);


}









// ==========================
// Advanced ML Weighted Score
// ==========================


const mlScore = (


mlFeatures.newBeneficiaryFlag * 0.25



+

(

mlFeatures.amountRatio > 2.5

?

0.25

:

0

)



+

(

velocity >=3

?

0.15

:

0

)



+

mlFeatures.timeAnomaly * 0.10



+

(

1 -

mlFeatures.deviceTrustScore

)

* 0.10



+

(

fraudHistory > 0

?

0.15

:

0

)


) * 100;







fraudScore = Math.round(

fraudScore * 0.60

+

mlScore * 0.40

);







fraudScore = Math.min(

fraudScore,

100

);









let riskLevel =

RISK_LEVEL.LOW;





if(fraudScore >=70){


riskLevel =

RISK_LEVEL.HIGH;


}

else if(fraudScore >=40){


riskLevel =

RISK_LEVEL.MEDIUM;


}






return {


fraudScore,


riskLevel,


fraudReasons,


mlFeatures


};



};
// ==========================
// Check New Beneficiary
// ==========================

const checkNewBeneficiary = async(
    userId,
    beneficiaryId
)=>{


if(!beneficiaryId)

return true;




const beneficiary =

await Beneficiary.findOne({

_id:beneficiaryId,

userId

});





if(!beneficiary)

return true;






const daysSinceAdded =

(

Date.now()

-

beneficiary.createdAt.getTime()

)

/

(

1000 *

60 *

60 *

24

);






return daysSinceAdded <= 7;


};









// ==========================
// User Spending Behaviour
// ==========================

const checkUserAmountBehaviour = async(

userId,

amount

)=>{


const transactions =

await Transaction.find({

userId,

status:"completed",

type:"debit"

})

.sort({

createdAt:-1

})

.limit(10);







if(transactions.length === 0){


return {


isAbnormal:

amount > 10000,


ratio:

amount / 1000


};


}







const averageAmount =

transactions.reduce(

(sum,tx)=>

sum + tx.amount,

0

)

/

transactions.length;







const ratio =

amount /

Math.max(

averageAmount,

1

);







return {


isAbnormal:

ratio > 2.5,


ratio


};


};











// ==========================
// Transaction Velocity
// ==========================

const checkTransactionVelocity = async(

userId

)=>{


const oneHourAgo =

new Date(

Date.now()

-

60 *

60 *

1000

);







return await Transaction.countDocuments({

userId,


createdAt:{

$gte:oneHourAgo

},


status:"completed"


});


};












// ==========================
// Previous Fraud History
// ==========================

const checkFraudHistory = async(

userId

)=>{


return await FraudLog.countDocuments({

userId,


riskLevel:{

$in:[

"MEDIUM",

"HIGH"

]

}


});


};












// ==========================
// Beneficiary History
// ==========================

const checkBeneficiaryHistory = async(

userId,

beneficiaryId

)=>{


return await Transaction.countDocuments({

userId,


beneficiaryId,


status:"completed"


});


};
// ==========================
// Unusual Time Detection
// ==========================

const checkUnusualTime = ()=>{


const hour =

new Date().getHours();





return (

hour >= 22 ||

hour < 6

);


};











// ==========================
// New Device Detection
// ==========================

const checkNewDevice = async(

userId,

deviceId

)=>{


if(!deviceId)

return true;






const user =

await User.findById(

userId

);







if(!user)

return true;








if(

!Array.isArray(

user.devices

)

){


return true;


}








return !user.devices.some(

device =>

device.deviceId === deviceId

);


};












// ==========================
// Export
// ==========================


module.exports = {


calculateFraudScore


};