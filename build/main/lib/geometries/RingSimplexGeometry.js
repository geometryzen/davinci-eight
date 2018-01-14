"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arc3_1 = require("../geometries/arc3");
var Simplex_1 = require("../geometries/Simplex");
var SimplexMode_1 = require("../geometries/SimplexMode");
var SliceSimplexPrimitivesBuilder_1 = require("../geometries/SliceSimplexPrimitivesBuilder");
var Spinor3_1 = require("../math/Spinor3");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
function computeVertices(a, b, axis, start, angle, generator, radialSegments, thetaSegments, vertices, uvs) {
    /**
     * `t` is the vector perpendicular to s in the plane of the ring.
     * We could use the generator an PI / 4 to calculate this or the cross product as here.
     */
    var perp = Vector3_1.Vector3.copy(axis).cross(start);
    /**
     * The distance of the vertex from the origin and center.
     */
    var radius = b;
    var radiusStep = (a - b) / radialSegments;
    for (var i = 0; i < radialSegments + 1; i++) {
        var begin = Vector3_1.Vector3.copy(start).scale(radius);
        var arcPoints = arc3_1.arc3(begin, angle, generator, thetaSegments);
        for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
            var arcPoint = arcPoints[j];
            vertices.push(arcPoint);
            // The coordinates vary between -a and +a, which we map to 0 and 1.
            uvs.push(new Vector2_1.Vector2([(arcPoint.dot(start) / a + 1) / 2, (arcPoint.dot(perp) / a + 1) / 2]));
        }
        radius += radiusStep;
    }
}
function vertexIndex(i, j, thetaSegments) {
    return i * (thetaSegments + 1) + j;
}
function makeTriangles(vertices, uvs, axis, radialSegments, thetaSegments, geometry) {
    for (var i = 0; i < radialSegments; i++) {
        // Our traversal has resulted in the following formula for the index
        // into the vertices or uvs array
        // vertexIndex(i, j) => i * (thetaSegments + 1) + j
        /**
         * The index along the start radial line where j = 0. This is just index(i,0)
         */
        var startLineIndex = i * (thetaSegments + 1);
        for (var j = 0; j < thetaSegments; j++) {
            /**
             * The index of the corner of the quadrilateral with the lowest value of i and j.
             * This corresponds to the smallest radius and smallest angle counterclockwise.
             */
            var quadIndex = startLineIndex + j;
            var v0 = quadIndex;
            var v1 = quadIndex + thetaSegments + 1; // Move outwards one segment.
            var v2 = quadIndex + thetaSegments + 2; // Then move one segment along the radius.
            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [Vector3_1.Vector3.copy(axis), Vector3_1.Vector3.copy(axis), Vector3_1.Vector3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
            v0 = quadIndex; // Start at the same corner
            v1 = quadIndex + thetaSegments + 2; // Move diagonally outwards and along radial
            v2 = quadIndex + 1; // Then move radially inwards
            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [Vector3_1.Vector3.copy(axis), Vector3_1.Vector3.copy(axis), Vector3_1.Vector3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
        }
    }
}
function makeLineSegments(vertices, radialSegments, thetaSegments, data) {
    for (var i = 0; i < radialSegments; i++) {
        for (var j = 0; j < thetaSegments; j++) {
            var simplex_1 = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.LINE);
            simplex_1.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
            simplex_1.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j + 1, thetaSegments)];
            data.push(simplex_1);
            simplex_1 = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.LINE);
            simplex_1.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
            simplex_1.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, j, thetaSegments)];
            data.push(simplex_1);
        }
        // TODO: We probably don't need these lines when the thing is closed 
        var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, thetaSegments, thetaSegments)];
        simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, thetaSegments, thetaSegments)];
        data.push(simplex);
    }
    // Lines for the outermost circle.
    for (var j = 0; j < thetaSegments; j++) {
        var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j, thetaSegments)];
        simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j + 1, thetaSegments)];
        data.push(simplex);
    }
}
function makePoints(vertices, radialSegments, thetaSegments, data) {
    for (var i = 0; i <= radialSegments; i++) {
        for (var j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.POINT);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
            data.push(simplex);
        }
    }
}
function makeEmpty(vertices, radialSegments, thetaSegments, data) {
    for (var i = 0; i <= radialSegments; i++) {
        for (var j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.EMPTY);
            data.push(simplex);
        }
    }
}
var RingSimplexGeometry = /** @class */ (function (_super) {
    tslib_1.__extends(RingSimplexGeometry, _super);
    function RingSimplexGeometry(a, b, sliceAngle) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        var _this = _super.call(this) || this;
        _this.e = Vector3_1.Vector3.vector(0, 1, 0);
        _this.cutLine = Vector3_1.Vector3.vector(0, 0, 1);
        _this.a = a;
        _this.b = b;
        return _this;
    }
    RingSimplexGeometry.prototype.isModified = function () {
        return _super.prototype.isModified.call(this);
    };
    RingSimplexGeometry.prototype.regenerate = function () {
        this.data = [];
        var radialSegments = this.flatSegments;
        var thetaSegments = this.curvedSegments;
        // TODO: The generator does not have to be dual to the axis
        var generator = Spinor3_1.Spinor3.dual(this.e, false);
        var vertices = [];
        var uvs = [];
        computeVertices(this.a, this.b, this.e, this.cutLine, this.sliceAngle, generator, radialSegments, thetaSegments, vertices, uvs);
        switch (this.k) {
            case SimplexMode_1.SimplexMode.EMPTY: {
                makeEmpty(vertices, radialSegments, thetaSegments, this.data);
                break;
            }
            case SimplexMode_1.SimplexMode.POINT: {
                makePoints(vertices, radialSegments, thetaSegments, this.data);
                break;
            }
            case SimplexMode_1.SimplexMode.LINE: {
                makeLineSegments(vertices, radialSegments, thetaSegments, this.data);
                break;
            }
            case SimplexMode_1.SimplexMode.TRIANGLE: {
                makeTriangles(vertices, uvs, this.e, radialSegments, thetaSegments, this);
                break;
            }
            default: {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
            }
        }
        this.setModified(false);
    };
    RingSimplexGeometry.prototype.setModified = function (modified) {
        _super.prototype.setModified.call(this, modified);
        return this;
    };
    return RingSimplexGeometry;
}(SliceSimplexPrimitivesBuilder_1.SliceSimplexPrimitivesBuilder));
exports.RingSimplexGeometry = RingSimplexGeometry;
