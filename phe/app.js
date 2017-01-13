/**
 * foxx service za manipuliranje z ArangoDB bazo
 */
(function () {
	'use strict';

	//includi / spremenljivke
    var Output = require("./factory/Output").Instance;
    var Response = require("./factory/Response").Instance;
    var Request = require("./factory/Request").Instance;
    var GeneralError = require("./factory/GeneralError").Instance;

    var _Controller = require("org/arangodb/foxx").Controller;
    var Controller = new _Controller(applicationContext);
    var Repository = require("org/arangodb/foxx").Repository;
    var Console = require("console");
    var Arangodb = require("org/arangodb");
    var DB = Arangodb.db;

    /**
     * General search
     */
    var test = new Request();
    test.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        /*var params = Request.getParams(req);

        //validate params
        if(typeof params.word == "undefined" || params.word == ""){
            return Response.newJsonResponse([]);
        }
        params.word = "%"+params.word+"%"

        //prepare query
        var aql = "" +
            "FOR destination IN MergedDestinations "+
                "LET destinationName = LOWER(destination.destinationName) "+

                "LET regionFound = LENGTH( "+
                    "FOR region IN destination.regions "+
                    "FILTER LOWER(region) LIKE @word "+
                    "LIMIT 0, 1 "+
                    "RETURN region "+
                ") > 0 "+

            "FILTER destinationName LIKE @word OR regionFound "+
            "RETURN {\"_key\": destination._key, \"destinationName\":destination.destinationName}";

        //create aql statement and execute it
        try{
            var s = DB._createStatement({"query": aql});
            s.bind("word", params.word);
            var r = s.execute().toArray();
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }*/
    });
    test.attach("/jan123");


}());