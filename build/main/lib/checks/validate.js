"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var isDefined_1 = require("./isDefined");
/**
 * Helper function for validating a named value and providing a default.
 */
function validate(name, value, defaultValue, assertFn) {
    if (isDefined_1.isDefined(value)) {
        return assertFn(name, value);
    }
    else {
        return defaultValue;
    }
}
exports.validate = validate;
