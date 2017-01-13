/**
 * Default request class
 */
(function () {
    "use strict";

    //includes
    var _Controller = require("org/arangodb/foxx").Controller;
    var Controller = new _Controller(applicationContext);
    var Response = require("./Response").Instance;
    var GeneralError = require("./GeneralError").Instance;
    var InvalidTokenError = require("./InvalidTokenError").Instance;
    var Output = require("./Output").Instance;

    /**
     * Request class constructor
     */
    var Request = function () {
        this.action = null;
    };
    Request.METHOD_POST = "POST";
    Request.METHOD_GET = "GET";

    /**
     * Set action when request is calles and get it's response
     */
    Request.prototype.setAction = function (action) {
        if(typeof action == "function") this.action = action;
    };
    Request.prototype.getResponse = function (req, res) {
        if(this.action != null) return this.action(req, res);
        else return null;
    };

    /**
     * Attach action to url
     *
     * @param url: relative url
     * @param methods: POST/GET (Request.METHOD_*). Default: POST and GET
     */
    Request.prototype.attach = function (url, methods) {
        var that = this;
        var defaultMethods = [Request.METHOD_GET, Request.METHOD_POST];

        //get methods
        if(typeof methods == "undefined"){
            methods = defaultMethods;
        }else if(typeof methods == "string"){
            methods = [methods];
        }

        //attach action for each method
        for (var i = 0; i < methods.length; i++){
            var method = methods[i];

            if(method == Request.METHOD_GET){
                Controller.get(url, function (req, res) {
                    try{
                        Output.response(res, that.getResponse(req, res));
                    }catch (e){
                        Output.response(res, Response.newErrorResponse(e));
                    }
                });
            }else if(method == Request.METHOD_POST){
                Controller.post(url, function (req, res) {
                    try{
                        Output.response(res, that.getResponse(req, res));
                    }catch (e){
                        Output.response(res, Response.newErrorResponse(e));
                    }
                });
            }
        }
    };

    /**
     * Parse parameters
     */
    Request.getParams = function (req) {
        var params = {};

        if(typeof req.requestBody != "undefined"){
            try{
                params = JSON.parse(req.requestBody);
            }catch(e){}
        }else{
            params = req.parameters;
        }

        return params;
    };

    /**
     * Vrže izjemo če je request token nepravilen.
     * Ta token je za enkrat kar shardcodiran, druga se ne splača delat dokler si ne uredimo ssl cartifikata.
     */
    Request.validateToken = function (token) {
        if(token != "JncCfXKasUtOtWeOjlymSJFVfUHcK0Ee") throw new InvalidTokenError();
    };

    exports.Instance = Request;
}());


