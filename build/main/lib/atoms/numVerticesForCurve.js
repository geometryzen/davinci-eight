"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numVerticesForCurve = void 0;
var mustBeInteger_1 = require("../checks/mustBeInteger");
/**
 * Computes the number of vertices required to construct a curve.
 */
function numVerticesForCurve(uSegments) {
    mustBeInteger_1.mustBeInteger('uSegments', uSegments);
    return uSegments + 1;
}
exports.numVerticesForCurve = numVerticesForCurve;
