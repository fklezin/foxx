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
     * GET LEADERBOARD
     */
    var getLeaderboard = new Request();
    getLeaderboard.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        var params = Request.getParams(req);

        //prepare query
        var aql = "" +
            "FOR record IN Leaderboard "+
                "SORT record.score DESC "+
                "LIMIT 0, 20 "+
                "RETURN record";

        //create aql statement and execute it
        try{
            var s = DB._createStatement({"query": aql});
            var r = s.execute().toArray();
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }
    });
    getLeaderboard.attach("/leaderboard");

    /**
     * INSERT RECORD
     */
    var insertRecord = new Request();
    insertRecord.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        var params = Request.getParams(req);

        /*validate params
        if(typeof params.user == "undefined" || params.user == ""){
            return Response.newJsonResponse(["wrongparams",params]);
        }*/

        //prepare query
        var aql = "LET doc="+params.user+
                  " INSERT doc INTO Leaderboard ";
        //create aql statement and execute it
        try{
            var s = DB._createStatement({"query": aql});
            //s.bind("user", params.user);
            var r = s.execute().toArray();
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }
    });
    insertRecord.attach("/insertRecord");


}());