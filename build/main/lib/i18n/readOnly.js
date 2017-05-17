"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeString_1 = require("../checks/mustBeString");
function readOnly(name) {
    mustBeString_1.mustBeString('name', name);
    var message = {
        get message() {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}
exports.readOnly = readOnly;
