const { MongoClient } = require("mongodb");

const uri =
"mongodb+srv://jagajeevan1810_db_user:Qgmhw3zXA75CbPKv@frauddetection.dqryzma.mongodb.net/nexusbank?retryWrites=true&w=majority";


const client = new MongoClient(uri);


async function test(){

    try{

        await client.connect();

        console.log("MongoDB Driver Connection Successful");

        await client.close();

    }
    catch(error){

        console.log("MongoDB Driver Error:");
        console.log(error.message);

    }

}


test();