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
        var params = Request.getParams(req);

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
        }
    });
    generalSearch.attach("/test");

    /**
     * tocAdmin
     * get all destinations
     *
     * @param start int: start index
     * @param limit: return object from start to start+limit
     */
    var getAllDestinations = new Request();
    getAllDestinations.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        var params = Request.getParams(req);

        //get and validate params
        var limit = "null";
        if(typeof params.start != "undefined" && typeof params.limit != "undefined"){
            params.start = parseInt(params.start);
            params.limit = parseInt(params.limit);
            if(!isNaN(params.start) && !isNaN(params.limit) && params.start >= 0 && params.limit >= 0){
                limit = "@start, @limit";
            }
        }

        //prepare query
        var aql = "FOR d IN MergedDestinations "+
                "LIMIT "+limit+" "+
                "RETURN { "+
                    '"_id": d._id, "_key":d._key, "gid":d.gid, "destinationName":d.destinationName, "source":d.source, "type":d.type, "tocId":d.tocId '+
                "}";

        //create aql statement and execute it
        try{
            var s = DB._createStatement({"query": aql});

            if(limit != "null"){
                s.bind("start", params.start);
                s.bind("limit", params.limit);
            }

            var r = s.execute().toArray();
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }
    });
    getAllDestinations.attach("/getAllDestinations");

    /**
     * tocAdmin
     *
     * getDestination by _key
     * @param key long: select by key
     */
    var getDestinationByKey = new Request();
    getDestinationByKey.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        var params = Request.getParams(req);

        //validate params
        var key = null;
        if(typeof params.key != "undefined" && !isNaN(params.key) && params.key > 0){
            key = Number(params.key);
        }else{
            throw new GeneralError("getDestinationByKey accepts 'key' param which mus be numeric and grater than 0", 1);
        }

        //prepare aql statement
        var aql = "" +
            "FOR d IN MergedDestinations\n" +
                "FILTER TO_NUMBER(d._key) == @key\n" +
                "RETURN {\n" +
                    "\"_id\": d._id,\n" +
                    "\"_key\": d._key,\n" +
                    "\"active\": d.active,\n" +
                    "\"airTemperature\": d.airTemperature,\n" +
                    "\"destinationName\": d.destinationName,\n" +
                    "\"gid\": d.gid,\n" +
                    "\"hotelCategory\": d.hotelCategory,\n" +
                    "\"latitude\": d.latitude,\n" +
                    "\"longitude\": d.longitude,\n" +
                    "\"lowestPrice\": d.lowestPrice,\n" +
                    "\"numberOfReviewers\": d.numberOfReviewers,\n" +
                    "\"picture\": d.picture,\n" +
                    "\"pricePerPerson\": d.pricePerPerson,\n" +
                    "\"regions\": d.regions,\n" +
                    "\"retrieveTime\": d.retrieveTime,\n" +
                    "\"source\": d.source,\n" +
                    "\"tocId\": d.tocId,\n" +
                    "\"tourOperators\": d.tourOperators,\n" +
                    "\"type\": d.type,\n" +
                    "\"waterTemperature\": d.waterTemperature,\n" +
                    "\"weather\": d.weather\n" +
                 "}";

        try{
            var s = DB._createStatement({"query": aql});
            s.bind("key", key);
            var r = s.execute().toArray();
            if(r.length > 0) r = r[0];
            else r = null;
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }
    });
    getDestinationByKey.attach("/getDestinationByKey");

    /**
     * tocAdmin
     * doda destinacijo v update kolekcijo (ustvari kopijo)
     * @param key long: kopiraj MergedDestination/_key v ModifiedDestinations/_key
     */
    var addDestinationToModified = new Request();
    addDestinationToModified.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        var params = Request.getParams(req);

        var key = null;
        if(typeof params.key != "undefined" && !isNaN(params.key) && params.key > 0){
            key = Number(params.key);
        }else{
            throw new GeneralError("addDestinationToModified accepts 'key' param which mus be numeric and grater than 0", 1);
        }

        var aql = "" +
            "FOR d IN MergedDestinations\n" +
                "FILTER TO_NUMBER(d._key) == @key\n" +
                "INSERT d INTO ModifiedDestinations\n" +
                "RETURN {\"_key\": d._key}";

        try{
            var s = DB._createStatement({"query": aql});
            s.bind("key", key);

            var r = s.execute().toArray();
            if(r.length > 0) r = r[0];
            else r = null;
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }
    });
    addDestinationToModified.attach("/addDestinationToModified");

    /**
     * tocAdmin
     * spremeni podatke destinacije v UpdatedDestinations
     *
     * @param key long: _key destinacije ki jo updatamo
     * @param data json: json objekt vrednosti, ki jih želimo posodobiti
     */
    var updateModifiedDestination = new Request();
    updateModifiedDestination.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        var params = Request.getParams(req);

        //validate args
        var invalidArgumentError = new GeneralError("Napaka v parametrih. Metoda sprejme:\n" +
            "@param key long: _key destinacije ki jo updatamo\n" +
            "@param data json: json objekt vrednosti, ki jih želimo posodobiti\n", 1);

        var key = null;
        if(typeof params.key != "undefined" && !isNaN(params.key) && params.key > 0){
            key = Number(params.key);
        }else{
            throw invalidArgumentError;
        }
        if(typeof params.data != "undefined"){
            try{
                params.data = JSON.parse(params.data);
            }catch (e){
                throw new GeneralError("Napaka v data json objektu.", 2);
            }
        }else {
            throw invalidArgumentError;
        }

        //prepare statement
        var aql = ""+
            "FOR d IN ModifiedDestinations\n" +
                "FILTER TO_NUMBER(d._key) == @key\n" +
                "UPDATE d WITH @data IN ModifiedDestinations\n" +
                "RETURN {\"_key\": d._key}";

        try{
            var s = DB._createStatement({"query": aql});
            s.bind("key", key);
            s.bind("data", params.data);

            var r = s.execute().toArray();
            if(r.length > 0) r = r[0];
            else r = null;
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }

    });
    updateModifiedDestination.attach("/updateModifiedDestination", Request.METHOD_POST);

    /**
     * tocAdmin
     *
     * odstrani destinacijo iz ModifiedDestinations
     * @param key long: key destinacije, ki jo želimo odstraniti
     */
    var deleteModifiedDestination = new Request();
    deleteModifiedDestination.setAction(function (req, res) {
        res.set("Content-Type", "application/json; charset=UTF-8");
        var params = Request.getParams(req);

        //validate params
        var key = null;
        if(typeof params.key != "undefined" && !isNaN(params.key) && params.key > 0){
            key = Number(params.key);
        }else{
            throw new GeneralError("deleteModifiedDestination accepts 'key' param which mus be numeric and grater than 0", 1);
        }

        var aql = "" +
            "FOR d IN ModifiedDestinations\n" +
                "FILTER TO_NUMBER(d._key) == @key\n" +
                "REMOVE d IN ModifiedDestinations\n" +
                "RETURN {\"_key\": d._key}";

        try{
            var s = DB._createStatement({"query": aql});
            s.bind("key", key);
            var r = s.execute().toArray();
            if(r.length > 0) r = r[0];
            else r = null;
            return Response.newJsonResponse(r);
        }catch (e){
            throw GeneralError.fromError(e);
        }
    });
    deleteModifiedDestination.attach("/deleteModifiedDestination");


}());