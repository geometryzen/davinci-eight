"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notSupported = void 0;
var mustBeString_1 = require("../checks/mustBeString");
function notSupported(name) {
    mustBeString_1.mustBeString('name', name);
    var message = {
        get message() {
            return "Method `" + name + "` is not supported.";
        }
    };
    return message;
}
exports.notSupported = notSupported;
