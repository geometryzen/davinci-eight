"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var SimplexPrimitivesBuilder_1 = require("../geometries/SimplexPrimitivesBuilder");
var Simplex_1 = require("../geometries/Simplex");
var SimplexMode_1 = require("../geometries/SimplexMode");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
/**
 * Scratch variables to avoid creating temporary objects.
 */
var a = Vector3_1.Vector3.zero();
var b = Vector3_1.Vector3.zero();
// Angle around the Y axis, counter-clockwise when looking from above.
function azimuth(vector) {
    return Math.atan2(vector.z, -vector.x);
}
// Angle above the XZ plane.
function inclination(pos) {
    return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
}
/**
 * Modifies the incoming point by projecting it onto the unit sphere.
 * Add the point to the array of points
 * Sets a hidden `index` property to the index in `points`
 * Computes the texture coordinates and sticks them in the hidden `uv` property as a Vector2.
 * OK!
 */
function prepare(point, points) {
    // Copy the point and project it onto the unit sphere.
    var vertex = Vector3_1.Vector3.copy(point).normalize();
    points.push(vertex);
    // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
    var u = azimuth(point) / 2 / Math.PI + 0.5;
    var v = inclination(point) / Math.PI + 0.5;
    var something = vertex;
    // This is a bit ugly from a type-safety perspective.
    // We could avoid it by working with a Vertex object instead.
    something['uv'] = new Vector2_1.Vector2([u, 1 - v]);
    return vertex;
}
// Texture fixing helper.
function correctUV(uv, vector, azimuth) {
    if ((azimuth < 0) && (uv.x === 1))
        uv = new Vector2_1.Vector2([uv.x - 1, uv.y]);
    if ((vector.x === 0) && (vector.z === 0))
        uv = new Vector2_1.Vector2([azimuth / 2 / Math.PI + 0.5, uv.y]);
    return uv.clone();
}
/**
 * Computes the normal associated with the three position vectors taken to represent a triangle with CCW-outside orientation.
 */
function normal(v1, v2, v3) {
    a.copy(v2).sub(v1);
    b.copy(v3).sub(v2);
    return Vector3_1.Vector3.copy(a).cross(b).normalize();
}
/**
 * In elementary geometry, a polyhedron is a solid in three dimensions with
 * flat polygonal faces, straight edges and sharp corners or vertices.
 */
var PolyhedronBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(PolyhedronBuilder, _super);
    /**
     *
     * param vertices {number} An array of 3 * N numbers representing N vertices.
     * param indices {number} An array of 3 * M numbers representing M triangles.
     *
     * param radius The distance of the polyhedron points from the origin.
     * param detail The number of times to subdivide the triangles in the faces.
     */
    function PolyhedronBuilder(vertices, indices, radius, detail) {
        if (radius === void 0) { radius = 1; }
        if (detail === void 0) { detail = 0; }
        var _this = _super.call(this) || this;
        var points = [];
        // Normalize the vertices onto a unit sphere, compute UV coordinates and return the points.
        for (var i = 0, l = vertices.length; i < l; i += 3) {
            prepare(new Vector3_1.Vector3([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
        }
        var faces = [];
        // Compute the Simplex faces, as given by the triples of indices.
        for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
            var v1 = points[indices[i]];
            var v2 = points[indices[i + 1]];
            var v3 = points[indices[i + 2]];
            var n = normal(v1, v2, v3);
            var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v1;
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3_1.Vector3.copy(n);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v2;
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3_1.Vector3.copy(n);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v3;
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3_1.Vector3.copy(n);
            faces[j] = simplex;
        }
        // Further subdivide the faces if more detail is required.
        for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
            subdivide(faces[i], detail, points, _this);
        }
        // Handle case when face straddles the seam
        /*
            for ( var i = 0, faceVertexUvsZeroLength = this.faceVertexUvs[ 0 ].length; i < faceVertexUvsZeroLength; i++ ) {
        
              var uvs = this.faceVertexUvs[ 0 ][ i ];
        
              var x0 = uvs[ 0 ].x;
              var x1 = uvs[ 1 ].x;
              var x2 = uvs[ 2 ].x;
        
              var max = Math.max( x0, Math.max( x1, x2 ) );
              var min = Math.min( x0, Math.min( x1, x2 ) );
        
              if ( max > 0.9 && min < 0.1 ) { // 0.9 is somewhat arbitrary
        
                if ( x0 < 0.2 ) uvs[ 0 ].x += 1;
                if ( x1 < 0.2 ) uvs[ 1 ].x += 1;
                if ( x2 < 0.2 ) uvs[ 2 ].x += 1;
        
              }
        
            }
        */
        // Apply radius
        for (var i = 0, verticesLength = points.length; i < verticesLength; i++) {
            points[i].scale(radius);
        }
        // Merge vertices
        _this.mergeVertices();
        function centroid(v1, v2, v3) {
            var x = (v1.x + v2.x + v3.x) / 3;
            var y = (v1.y + v2.y + v3.y) / 3;
            var z = (v1.z + v2.z + v3.z) / 3;
            return { x: x, y: y, z: z };
        }
        // Approximate a curved face with recursively sub-divided triangles.
        function make(v1, v2, v3, builder) {
            var azi = azimuth(centroid(v1, v2, v3));
            var something1 = v1;
            var something2 = v2;
            var something3 = v3;
            // This is a bit ugly from a type-safety perspective.
            var uv1 = correctUV(something1['uv'], v1, azi);
            var uv2 = correctUV(something2['uv'], v2, azi);
            var uv3 = correctUV(something3['uv'], v3, azi);
            var n = normal(v1, v2, v3);
            var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3_1.Vector3.copy(v1);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3_1.Vector3.copy(n);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv1;
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3_1.Vector3.copy(v2);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3_1.Vector3.copy(n);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv2;
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3_1.Vector3.copy(v3);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3_1.Vector3.copy(n);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv3;
            builder.data.push(simplex);
        }
        // Subdivide a face to the required detail level.
        function subdivide(face, detail, points, builder) {
            var cols = Math.pow(2, detail);
            var a = prepare(face.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var b = prepare(face.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var c = prepare(face.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var v = [];
            // Construct all of the vertices for this subdivision.
            for (var i = 0; i <= cols; i++) {
                v[i] = [];
                var aj = prepare(Vector3_1.Vector3.copy(a).lerp(c, i / cols), points);
                var bj = prepare(Vector3_1.Vector3.copy(b).lerp(c, i / cols), points);
                var rows = cols - i;
                for (var j = 0; j <= rows; j++) {
                    if (j === 0 && i === cols) {
                        v[i][j] = aj;
                    }
                    else {
                        v[i][j] = prepare(Vector3_1.Vector3.copy(aj).lerp(bj, j / rows), points);
                    }
                }
            }
            // Construct all of the faces.
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                    var k = Math.floor(j / 2);
                    if (j % 2 === 0) {
                        make(v[i][k + 1], v[i + 1][k], v[i][k], builder);
                    }
                    else {
                        make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k], builder);
                    }
                }
            }
        }
        return _this;
    }
    PolyhedronBuilder.prototype.regenerate = function () {
        // Ignore, we shouldn't but we do.
    };
    return PolyhedronBuilder;
}(SimplexPrimitivesBuilder_1.SimplexPrimitivesBuilder));
exports.PolyhedronBuilder = PolyhedronBuilder;
