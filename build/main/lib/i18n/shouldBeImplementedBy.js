"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeString_1 = require("../checks/mustBeString");
function shouldBeImplementedBy(name, type) {
    mustBeString_1.mustBeString('name', name);
    var message = {
        get message() {
            return "Method '" + name + "' should be implemented by " + type + ".";
        }
    };
    return message;
}
exports.shouldBeImplementedBy = shouldBeImplementedBy;
