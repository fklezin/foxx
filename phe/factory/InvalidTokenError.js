(function () {
	"use strict";
	var Foxx = require("org/arangodb/foxx");
	var GeneralError = require("./GeneralError").Instance;

	var InvalidTokenError = function () {
		this.message = "Request token is not valid.";
		this.code = 403;
	};
	InvalidTokenError.prototype = new GeneralError();

	InvalidTokenError.prototype.toString = function () {
		return JSON.stringify(this);
	};

	exports.Instance = InvalidTokenError;
}());