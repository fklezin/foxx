(function () {
	"use strict";
	var Foxx = require("org/arangodb/foxx");

	var GeneralError = function (message, code) {
		this.message = "Request failed!";
		this.code = 300;

		if(typeof message != "undefined") this.message = message;
		if(typeof code != "undefined") this.code = code;
	};
	GeneralError.prototype = new Error();

	GeneralError.prototype.toString = function () {
		return JSON.stringify(this);
	};

	GeneralError.fromError = function (error) {
		return new GeneralError(error.message, error.code);
	};

	exports.Instance = GeneralError;
}());