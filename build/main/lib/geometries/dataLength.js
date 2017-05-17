"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric2_1 = require("../math/Geometric2");
var Geometric3_1 = require("../math/Geometric3");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
function dataLength(source) {
    if (source instanceof Geometric3_1.Geometric3) {
        if (source.length !== 8) {
            throw new Error("source.length (" + source.length + ") is expected to be 8");
        }
        return 3;
    }
    else if (source instanceof Geometric2_1.Geometric2) {
        if (source.length !== 4) {
            throw new Error("source.length (" + source.length + ") is expected to be 4");
        }
        return 2;
    }
    else if (source instanceof Vector3_1.Vector3) {
        if (source.length !== 3) {
            throw new Error("source.length (" + source.length + ") is expected to be 3");
        }
        return 3;
    }
    else if (source instanceof Vector2_1.Vector2) {
        if (source.length !== 2) {
            throw new Error("source.length (" + source.length + ") is expected to be 2");
        }
        return 2;
    }
    else {
        if (source.length === 1) {
            return 1;
        }
        else if (source.length === 2) {
            return 2;
        }
        else if (source.length === 3) {
            return 3;
        }
        else if (source.length === 4) {
            return 4;
        }
        else {
            throw new Error("dataLength(source: VectorN<number>): AttributeSizeType, source.length => " + source.length);
        }
    }
}
exports.dataLength = dataLength;
