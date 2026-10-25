const Transaction = require("../models/Transaction");
const FraudLog = require("../models/FraudLog");
const User = require("../models/User");


// ==========================
// Verify Admin Passkey
// ==========================
exports.verifyPasskey = async (req, res) => {

  try {

    const { passkey } = req.body;


    if (!passkey) {

      return res.status(400).json({
        success: false,
        message: "Passkey is required",
      });

    }



    if (!process.env.ADMIN_SESSION_PASSKEY) {

      return res.status(500).json({
        success: false,
        message: "Admin passkey is not configured",
      });

    }



    if (passkey !== process.env.ADMIN_SESSION_PASSKEY) {

      return res.status(401).json({
        success:false,
        message:"Invalid passkey",
      });

    }



    return res.status(200).json({

      success:true,

      message:"Admin verified successfully",

      admin:true,

    });



  } catch(error) {


    console.error(
      "Verify Passkey Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:"Internal Server Error",

    });


  }

};





// ==========================
// Get All Transactions
// ==========================
exports.getAllTransactions = async(req,res)=>{

try{


const transactions =
await Transaction.find()

.populate(
"userId",
"fullName email accountNumber"
)

.populate(
"beneficiaryId"
)

.sort({
createdAt:-1
})

.limit(100);



return res.status(200).json({

success:true,

count:transactions.length,

transactions

});



}catch(error){


console.error(
"Get Transactions Error:",
error
);


return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}

};





// ==========================
// Get Fraud Logs
// ==========================
exports.getFraudLogs = async(req,res)=>{


try{


const fraudLogs =
await FraudLog.find()

.populate(
"userId",
"fullName email accountNumber"
)

.populate(
"transactionId"
)

.sort({
createdAt:-1
})

.limit(50);



return res.status(200).json({

success:true,

count:fraudLogs.length,

fraudLogs

});



}catch(error){


console.error(
"Get Fraud Logs Error:",
error
);


return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};
// ==========================
// Review High Risk Transaction
// ==========================
exports.reviewTransaction = async (req, res) => {

  try {

    const {
      transactionId,
      action
    } = req.body;



    if (!transactionId || !action) {

      return res.status(400).json({

        success:false,

        message:
        "Transaction ID and action are required"

      });

    }




    if (!["APPROVED","REJECTED"].includes(action)) {

      return res.status(400).json({

        success:false,

        message:"Invalid action"

      });

    }





    const transaction =
      await Transaction.findById(transactionId);



    if (!transaction) {

      return res.status(404).json({

        success:false,

        message:"Transaction not found"

      });

    }





    if (transaction.status === "COMPLETED") {

      return res.status(400).json({

        success:false,

        message:"Transaction is already completed"

      });

    }





    if (transaction.status === "BLOCKED") {

      return res.status(400).json({

        success:false,

        message:"Transaction is already blocked"

      });

    }





    const fraudLog =
      await FraudLog.findOne({
        transactionId
      });





    if (action === "APPROVED") {


      const user =
        await User.findById(transaction.userId);



      if (!user) {

        return res.status(404).json({

          success:false,

          message:"User not found"

        });

      }




      if (user.balance < transaction.amount) {

        return res.status(400).json({

          success:false,

          message:"Insufficient balance"

        });

      }




      user.balance -= transaction.amount;

      await user.save();



      transaction.status =
        "COMPLETED";



    } else {


      transaction.status =
        "BLOCKED";


    }





    if (fraudLog) {

      fraudLog.adminAction =
        action;

      await fraudLog.save();

    }





    await transaction.save();




    return res.status(200).json({

      success:true,

      message:
      `Transaction ${action.toLowerCase()} successfully`,

      transaction

    });




  } catch(error) {


    console.error(
      "Review Transaction Error:",
      error
    );



    return res.status(500).json({

      success:false,

      message:"Internal Server Error"

    });


  }

};





// ==========================
// Dashboard Statistics
// ==========================
exports.getStats = async(req,res)=>{


try{


const [

totalTransactions,

blockedTransactions,

verificationRequired,

highRiskCount

] = await Promise.all([


Transaction.countDocuments(),


Transaction.countDocuments({
status:"BLOCKED"
}),


Transaction.countDocuments({
status:"VERIFICATION_REQUIRED"
}),


Transaction.countDocuments({
riskLevel:"HIGH"
})


]);





const avgFraudScore =
await Transaction.aggregate([

{

$group:{

_id:null,

averageScore:{
$avg:"$fraudScore"
}

}

}

]);





return res.status(200).json({

success:true,


stats:{


totalTransactions,


blockedTransactions,


verificationRequired,


highRiskCount,


avgFraudScore:

avgFraudScore.length > 0

?

Number(
avgFraudScore[0].averageScore.toFixed(2)
)

:

0


}


});




}catch(error){


console.error(
"Dashboard Stats Error:",
error
);



return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};