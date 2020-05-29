import { __extends } from "tslib";
import { PolyhedronBuilder } from '../geometries/PolyhedronBuilder';
//
// The octahedron is dual to the cube.
// Imagine 6 vertices sitting at the center of each face of a cube.
// The vertices, as listed below, are:
// [0] (+1, 0, 0) right
// [1] (-1, 0, 0) left
// [2] (0, +1, 0) top
// [3] (0, -1, 0) bottom
// [4] (0, 0, +1) front
// [5] (0, 0, -1) back
//
var vertices = [
    +1, 0, 0, -1, 0, 0, 0, +1, 0, 0, -1, 0, 0, 0, +1, 0, 0, -1
];
//
// The following 24 indices comprise 8 triangles which are the faces of the octahedron.
//
var indices = [
    0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
];
var OctahedronBuilder = /** @class */ (function (_super) {
    __extends(OctahedronBuilder, _super);
    function OctahedronBuilder(radius, detail) {
        return _super.call(this, vertices, indices, radius, detail) || this;
    }
    return OctahedronBuilder;
}(PolyhedronBuilder));
export { OctahedronBuilder };
