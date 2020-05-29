"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectArg = void 0;
var isUndefined_1 = require("../checks/isUndefined");
var mustBeNumber_1 = require("../checks/mustBeNumber");
function message(standard, override) {
    return isUndefined_1.isUndefined(override) ? standard : override();
}
// FIXME: This plays havok with the TypeScript compiler stack and encourages temporary object creation.
function expectArg(name, value) {
    var arg = {
        toSatisfy: function (condition, message) {
            if (isUndefined_1.isUndefined(condition)) {
                throw new Error("condition must be specified");
            }
            if (isUndefined_1.isUndefined(message)) {
                throw new Error("message must be specified");
            }
            if (!condition) {
                throw new Error(message);
            }
            return arg;
        },
        toBeBoolean: function (override) {
            var typeOfValue = typeof value;
            if (typeOfValue !== 'boolean') {
                throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
            }
            return arg;
        },
        toBeDefined: function () {
            var typeOfValue = typeof value;
            if (typeOfValue === 'undefined') {
                var message_1 = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
                throw new Error(message_1);
            }
            return arg;
        },
        toBeInClosedInterval: function (lower, upper) {
            var something = value;
            var x = something;
            mustBeNumber_1.mustBeNumber('x', x);
            if (x >= lower && x <= upper) {
                return arg;
            }
            else {
                var message_2 = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
                throw new Error(message_2);
            }
        },
        toBeFunction: function () {
            var typeOfValue = typeof value;
            if (typeOfValue !== 'function') {
                var message_3 = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
                throw new Error(message_3);
            }
            return arg;
        },
        toBeNumber: function (override) {
            var typeOfValue = typeof value;
            if (typeOfValue !== 'number') {
                throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
            }
            return arg;
        },
        toBeObject: function (override) {
            var typeOfValue = typeof value;
            if (typeOfValue !== 'object') {
                throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
            }
            return arg;
        },
        toBeString: function () {
            var typeOfValue = typeof value;
            if (typeOfValue !== 'string') {
                var message_4 = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
                throw new Error(message_4);
            }
            return arg;
        },
        toBeUndefined: function () {
            var typeOfValue = typeof value;
            if (typeOfValue !== 'undefined') {
                var message_5 = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
                throw new Error(message_5);
            }
            return arg;
        },
        toNotBeNull: function () {
            if (value === null) {
                var message_6 = "Expecting argument " + name + " to not be null.";
                throw new Error(message_6);
            }
            else {
                return arg;
            }
        },
        get value() {
            return value;
        }
    };
    return arg;
}
exports.expectArg = expectArg;
