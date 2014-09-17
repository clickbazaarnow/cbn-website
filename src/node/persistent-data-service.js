var dynamodb = require("vogels");
dynamodb.AWS.config.loadFromPath(".clickbazaarnow")

var PUIDCreator = require("./dynamodbTables/PUID-creator");

var puidGen = new PUIDCreator(dynamodb);
puidGen.generatePUID(function(err, PUID) {
    if(err) {
        console.log("error is ", err);
    } else {
        console.log("generated PUID is  " +  PUID);
    }
});
