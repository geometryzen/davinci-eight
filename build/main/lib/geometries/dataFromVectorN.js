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
function dataFromVectorN(source) {
    if (source instanceof Geometric3_1.Geometric3) {
        var g3 = source;
        return [g3.x, g3.y, g3.z];
    }
    else if (source instanceof Geometric2_1.Geometric2) {
        var g2 = source;
        return [g2.x, g2.y];
    }
    else if (source instanceof Vector3_1.Vector3) {
        var v3 = source;
        return [v3.x, v3.y, v3.z];
    }
    else if (source instanceof Vector2_1.Vector2) {
        var v2 = source;
        return [v2.x, v2.y];
    }
    else {
        // console.warn("dataFromVectorN(source: VectorN<number>): number[], source.length => " + source.length)
        return source.toArray();
    }
}
exports.dataFromVectorN = dataFromVectorN;
