"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplexModeFromOptions = void 0;
var isDefined_1 = require("../checks/isDefined");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var GeometryMode_1 = require("../geometries/GeometryMode");
var SimplexMode_1 = require("../geometries/SimplexMode");
/**
 * Converts from a mode, k, or wireFrame option specification to a SimplexMode.
 */
function simplexModeFromOptions(options, fallback) {
    if (options === void 0) { options = {}; }
    if (isDefined_1.isDefined(options)) {
        if (isDefined_1.isDefined(options.mode)) {
            switch (options.mode) {
                case GeometryMode_1.GeometryMode.MESH: return SimplexMode_1.SimplexMode.TRIANGLE;
                case GeometryMode_1.GeometryMode.WIRE: return SimplexMode_1.SimplexMode.LINE;
                case GeometryMode_1.GeometryMode.POINT: return SimplexMode_1.SimplexMode.POINT;
                case 'mesh': return SimplexMode_1.SimplexMode.TRIANGLE;
                case 'wire': return SimplexMode_1.SimplexMode.LINE;
                case 'point': return SimplexMode_1.SimplexMode.POINT;
                default: {
                    throw new Error("Unknown mode: " + options.mode);
                }
            }
        }
        else if (isDefined_1.isDefined(options.wireFrame)) {
            return mustBeBoolean_1.mustBeBoolean('wireFrame', options.wireFrame) ? SimplexMode_1.SimplexMode.LINE : fallback;
        }
        else if (isDefined_1.isDefined(options.k)) {
            var k = mustBeInteger_1.mustBeInteger('k', options.k);
            switch (k) {
                case SimplexMode_1.SimplexMode.EMPTY: return SimplexMode_1.SimplexMode.EMPTY;
                case SimplexMode_1.SimplexMode.POINT: return SimplexMode_1.SimplexMode.POINT;
                case SimplexMode_1.SimplexMode.LINE: return SimplexMode_1.SimplexMode.LINE;
                case SimplexMode_1.SimplexMode.TRIANGLE: return SimplexMode_1.SimplexMode.TRIANGLE;
                default: {
                    throw new Error("k: SimplexMode must be -1, 0, 1, or 2");
                }
            }
        }
        else {
            // In the absence of any hints to the contrary we assume...
            return fallback;
        }
    }
    else {
        return fallback;
    }
}
exports.simplexModeFromOptions = simplexModeFromOptions;
