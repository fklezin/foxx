/**
 * Default response class
 */
(function () {
    "use strict";
    var Foxx = require("org/arangodb/foxx");

    var Response = function (response, error) {
        this.response = response;
        this.code = 0;
        this.error = null;

        if(typeof error != "undefined"){
            this.error = error;
            this.code = error.code;
        }
    };

    Response.prototype.toString = function () {
        return JSON.stringify(this);
    };

    Response.newResponse = function(object){
        return new Response(object);
    };
    Response.newJsonResponse = function (object) {
        return new Response(JSON.stringify(object));
    };
    Response.newErrorResponse = function (error) {
        return new Response(null, error);
    };

    exports.Instance = Response;
}());


