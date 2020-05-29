"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cannotAssignTypeToProperty = void 0;
var mustBeString_1 = require("../checks/mustBeString");
function cannotAssignTypeToProperty(type, name) {
    mustBeString_1.mustBeString('type', type);
    mustBeString_1.mustBeString('name', name);
    var message = {
        get message() {
            return "Cannot assign type `" + type + "` to property `" + name + "`.";
        }
    };
    return message;
}
exports.cannotAssignTypeToProperty = cannotAssignTypeToProperty;
