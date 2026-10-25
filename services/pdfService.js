const PDFDocument = require("pdfkit");


// ==========================
// Generate Bank Statement PDF
// ==========================

const generateStatementPDF = (
    user,
    transactions,
    res
)=>{


    const doc = new PDFDocument({
        margin:50
    });



    res.setHeader(
        "Content-Type",
        "application/pdf"
    );


    res.setHeader(
        "Content-Disposition",
        "attachment; filename=NexusBank_Statement.pdf"
    );



    doc.pipe(res);




    // Header

    doc
    .fontSize(22)
    .text(
        "NexusBank",
        {
            align:"center"
        }
    );


    doc.moveDown();



    doc
    .fontSize(16)
    .text(
        "Bank Account Statement"
    );


    doc.moveDown();



    doc
    .fontSize(12)
    .text(
        `Customer Name: ${user.fullName}`
    );


    doc.text(
        `Account Number: ${user.accountNumber}`
    );


    doc.text(
        `Generated Date: ${new Date().toDateString()}`
    );



    doc.moveDown(2);




    doc
    .fontSize(15)
    .text(
        "Transaction History"
    );



    doc.moveDown();





    transactions.forEach((txn,index)=>{


        doc
        .fontSize(10)
        .text(

`
${index+1}.
Transaction ID: ${txn.transactionId}

Amount: ₹${txn.amount}

Type: ${txn.type}

Status: ${txn.status}

Risk Level: ${txn.riskLevel}

Date: ${new Date(txn.createdAt).toDateString()}

--------------------------------
`

        );


    });





    doc.end();


};





module.exports = {

    generateStatementPDF

};