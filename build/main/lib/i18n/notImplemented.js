"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeString_1 = require("../checks/mustBeString");
function notImplemented(name) {
    mustBeString_1.mustBeString('name', name);
    var message = {
        get message() {
            return "'" + name + "' method is not yet implemented.";
        }
    };
    return message;
}
exports.notImplemented = notImplemented;
