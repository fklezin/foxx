/**
 * System out class
 */
(function () {
    "use strict";

    //includes
    var _Controller = require("org/arangodb/foxx").Controller;
    var Controller = new _Controller(applicationContext);
    var Internal = require("internal");


    /**
     * Output class constructor
     */
    var Output = function (res) {
        this.res = res;
    };
    Output.debug = true;


    Output._getErrorObject = function (){
        try { throw new Error('lala'); } catch(err) { return err; }
    };
    Output._getCallInfo = function () {
        var err = Output._getErrorObject();
        var caller_line = err.stack.split("\n")[4];
        var index = caller_line.indexOf("at ");
        return caller_line.slice(index+2, caller_line.length).trim();
    };


    /**
     * Add to response
     */
    Output.response = function (res, string) {
        if(typeof res.body == "undefined") res.body = "";
        res.body += string;
    };
    Output.prototype.response = function (string) {
        Output.print(this.res, string);
    };


    /**
     * Debug log
     */
    Output.log = function (data) {
        if(!Output.debug) return;

        Internal.print("=== ["+this._getCallInfo()+"] ===");
        if(typeof data == "object") data = JSON.stringify(data, null, 4);
        Internal.print(data);
    };

    /**
     * Print log
     */
    Output.print = function (data) {
        Internal.print(data);
    };



    exports.Instance = Output;
}());


