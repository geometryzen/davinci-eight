"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryMode = void 0;
/**
 * Determines how a Geometry will be rendered.
 */
var GeometryMode;
(function (GeometryMode) {
    /**
     *
     */
    GeometryMode[GeometryMode["POINT"] = 0] = "POINT";
    /**
     *
     */
    GeometryMode[GeometryMode["WIRE"] = 1] = "WIRE";
    /**
     *
     */
    GeometryMode[GeometryMode["MESH"] = 2] = "MESH";
})(GeometryMode = exports.GeometryMode || (exports.GeometryMode = {}));
