const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


dns.resolveSrv(
    "_mongodb._tcp.cluster0.ylevnon.mongodb.net",
    (err, addresses)=>{

        if(err){
            console.log("DNS ERROR:");
            console.log(err);
        }
        else{
            console.log("DNS SUCCESS:");
            console.log(addresses);
        }

    }
);