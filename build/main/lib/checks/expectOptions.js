"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectOptions = void 0;
var mustBeArray_1 = require("./mustBeArray");
/**
 * Determines whether the actual options supplied are expected.
 *
 * Usage:
 *
 * expectOptions(['foo', 'bar'], Object.keys(options));
 *
 */
function expectOptions(expects, actuals) {
    mustBeArray_1.mustBeArray('expects', expects);
    mustBeArray_1.mustBeArray('actuals', actuals);
    var iLength = actuals.length;
    for (var i = 0; i < iLength; i++) {
        var actual = actuals[i];
        if (expects.indexOf(actual) < 0) {
            throw new Error(actual + " is not one of the expected options: " + JSON.stringify(expects, null, 2) + ".");
        }
    }
}
exports.expectOptions = expectOptions;
