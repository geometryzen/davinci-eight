"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geometryModeFromOptions = void 0;
var isDefined_1 = require("../checks/isDefined");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var GeometryMode_1 = require("../geometries/GeometryMode");
var SimplexMode_1 = require("../geometries/SimplexMode");
/**
 * Converts from a mode, k, or wireFrame option specification to a GeometryMode.
 */
function geometryModeFromOptions(options, fallback, suppressWarnings) {
    if (fallback === void 0) { fallback = GeometryMode_1.GeometryMode.MESH; }
    if (suppressWarnings === void 0) { suppressWarnings = false; }
    if (isDefined_1.isDefined(options)) {
        if (isDefined_1.isDefined(options.mode)) {
            switch (options.mode) {
                case GeometryMode_1.GeometryMode.POINT: return options.mode;
                case GeometryMode_1.GeometryMode.WIRE: return options.mode;
                case GeometryMode_1.GeometryMode.MESH: return options.mode;
                case 'mesh': return GeometryMode_1.GeometryMode.MESH;
                case 'wire': return GeometryMode_1.GeometryMode.WIRE;
                case 'point': return GeometryMode_1.GeometryMode.POINT;
                default: {
                    throw new Error("mode must be POINT = " + GeometryMode_1.GeometryMode.POINT + ", WIRE = " + GeometryMode_1.GeometryMode.WIRE + ", or MESH = " + GeometryMode_1.GeometryMode.MESH);
                }
            }
        }
        else if (isDefined_1.isDefined(options.wireFrame)) {
            if (!suppressWarnings) {
                console.warn("wireFrame: boolean is deprecated. Please use mode: GeometryMode instead.");
            }
            return mustBeBoolean_1.mustBeBoolean('wireFrame', options.wireFrame) ? GeometryMode_1.GeometryMode.WIRE : fallback;
        }
        else if (isDefined_1.isDefined(options.k)) {
            if (!suppressWarnings) {
                console.warn("k: SimplexMode is deprecated. Please use mode: GeometryMode instead.");
            }
            var k = mustBeInteger_1.mustBeInteger('k', options.k);
            switch (k) {
                case SimplexMode_1.SimplexMode.POINT: return GeometryMode_1.GeometryMode.POINT;
                case SimplexMode_1.SimplexMode.LINE: return GeometryMode_1.GeometryMode.WIRE;
                case SimplexMode_1.SimplexMode.TRIANGLE: return GeometryMode_1.GeometryMode.MESH;
                default: {
                    throw new Error("k must be POINT = " + SimplexMode_1.SimplexMode.POINT + ", LINE = " + SimplexMode_1.SimplexMode.LINE + ", or TRIANGLE = " + SimplexMode_1.SimplexMode.TRIANGLE);
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
exports.geometryModeFromOptions = geometryModeFromOptions;
