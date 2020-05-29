"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quadrilateral = void 0;
var triangle_1 = require("../geometries/triangle");
function setAttributes(which, source, target) {
    var names = Object.keys(source);
    var namesLength = names.length;
    var i;
    var name;
    var values;
    for (i = 0; i < namesLength; i++) {
        name = names[i];
        values = source[name];
        target[name] = which.map(function (index) { return values[index]; });
    }
}
/**
 * quadrilateral
 *
 *  b-------a
 *  |       |
 *  |       |
 *  |       |
 *  c-------d
 *
 * The quadrilateral is split into two triangles: b-c-a and d-a-c, like a "Z".
 * The zeroth vertex for each triangle is opposite the other triangle.
 */
function quadrilateral(a, b, c, d, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    var triatts = {};
    setAttributes([1, 2, 0], attributes, triatts);
    triangle_1.triangle(b, c, a, triatts, triangles);
    setAttributes([3, 0, 2], attributes, triatts);
    triangle_1.triangle(d, a, c, triatts, triangles);
    return triangles;
}
exports.quadrilateral = quadrilateral;
