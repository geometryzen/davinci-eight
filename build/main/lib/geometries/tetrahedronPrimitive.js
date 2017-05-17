"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var PolyhedronBuilder_1 = require("../geometries/PolyhedronBuilder");
//
// Imagine 4 vertices sitting on some of the vertices of a cube of side-length 2.
// The vertices are:
// [0] (+1, +1, +1)
// [1] (-1, -1, +1)
// [2] (-1, +1, -1)
// [3] (+1, -1, -1)
//
// This is seen to form a tetrahedron because all of the side lengths are
// the same, sqrt(8), because the side length of the cube is 2. So we have
// four equilateral triangles stiched together to form a tetrahedron.
//
var vertices = [
    +1, +1, +1, -1, -1, +1, -1, +1, -1, +1, -1, -1
];
//
// The following 12 indices comprise four triangles.
// Each triangle is traversed counter-clockwise as seen from the outside. 
//
var indices = [
    2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
];
function tetrahedronPrimitive(options) {
    if (options === void 0) { options = { kind: 'TetrahedronGeometry' }; }
    var radius = isDefined_1.isDefined(options.radius) ? mustBeNumber_1.mustBeNumber('radius', options.radius) : 1.0;
    var builder = new PolyhedronBuilder_1.PolyhedronBuilder(vertices, indices, radius);
    var primitives = builder.toPrimitives();
    if (primitives.length === 1) {
        return primitives[0];
    }
    else {
        throw new Error("Expecting PolyhedronBuilder to return one Primitive.");
    }
}
exports.tetrahedronPrimitive = tetrahedronPrimitive;
