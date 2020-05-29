"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tetrahedron = void 0;
var expectArg_1 = require("../checks/expectArg");
var triangle_1 = require("../geometries/triangle");
var VectorN_1 = require("../math/VectorN");
/**
 * terahedron
 *
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 */
function tetrahedron(a, b, c, d, attributes, triangles) {
    if (attributes === void 0) { attributes = {}; }
    if (triangles === void 0) { triangles = []; }
    expectArg_1.expectArg('a', a).toSatisfy(a instanceof VectorN_1.VectorN, "a must be a VectorN");
    expectArg_1.expectArg('b', b).toSatisfy(b instanceof VectorN_1.VectorN, "b must be a VectorN");
    expectArg_1.expectArg('c', c).toSatisfy(c instanceof VectorN_1.VectorN, "c must be a VectorN");
    expectArg_1.expectArg('d', d).toSatisfy(d instanceof VectorN_1.VectorN, "d must be a VectorN");
    var triatts = {};
    var points = [a, b, c, d];
    var faces = [];
    triangle_1.triangle(points[0], points[1], points[2], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle_1.triangle(points[1], points[3], points[2], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle_1.triangle(points[2], points[3], points[0], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle_1.triangle(points[3], points[1], points[0], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    return triangles;
}
exports.tetrahedron = tetrahedron;
