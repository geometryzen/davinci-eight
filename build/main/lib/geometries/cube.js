"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var quadrilateral_1 = require("../geometries/quadrilateral");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
/**
 * cube as Simplex[]
 *
 *    v6----- v5
 *   /|      /|
 *  v1------v0|
 *  | |     | |
 *  | |v7---|-|v4
 *  |/      |/
 *  v2------v3
 */
function cube(size) {
    if (size === void 0) { size = 1; }
    var s = size / 2;
    var vec0 = new Vector3_1.Vector3([+s, +s, +s]);
    var vec1 = new Vector3_1.Vector3([-s, +s, +s]);
    var vec2 = new Vector3_1.Vector3([-s, -s, +s]);
    var vec3 = new Vector3_1.Vector3([+s, -s, +s]);
    var vec4 = new Vector3_1.Vector3([+s, -s, -s]);
    var vec5 = new Vector3_1.Vector3([+s, +s, -s]);
    var vec6 = new Vector3_1.Vector3([-s, +s, -s]);
    var vec7 = new Vector3_1.Vector3([-s, -s, -s]);
    var c00 = new Vector2_1.Vector2([0, 0]);
    var c01 = new Vector2_1.Vector2([0, 1]);
    var c10 = new Vector2_1.Vector2([1, 0]);
    var c11 = new Vector2_1.Vector2([1, 1]);
    var attributes = {};
    attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = [c11, c01, c00, c10];
    // We currently call quadrilateral rather than square because of the arguments.
    var front = quadrilateral_1.quadrilateral(vec0, vec1, vec2, vec3, attributes);
    var right = quadrilateral_1.quadrilateral(vec0, vec3, vec4, vec5, attributes);
    var top = quadrilateral_1.quadrilateral(vec0, vec5, vec6, vec1, attributes);
    var left = quadrilateral_1.quadrilateral(vec1, vec6, vec7, vec2, attributes);
    var bottom = quadrilateral_1.quadrilateral(vec7, vec4, vec3, vec2, attributes);
    var back = quadrilateral_1.quadrilateral(vec4, vec7, vec6, vec5, attributes);
    var squares = [front, right, top, left, bottom, back];
    // TODO: Fix up the opposing property so that the cube is fully linked together.
    return squares.reduce(function (a, b) { return a.concat(b); }, []);
}
exports.cube = cube;
