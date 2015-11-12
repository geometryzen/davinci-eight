var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../geometries/SimplexGeometry', '../geometries/Simplex', '../core/Symbolic', '../math/R2', '../math/R3'], function (require, exports, Euclidean3, SimplexGeometry, Simplex, Symbolic, R2, R3) {
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
     * Computes the texture coordinates and sticks them in the hidden `uv` property as a R2.
     * OK!
     */
    function prepare(point, points) {
        var vertex = R3.copy(point).direction();
        points.push(vertex);
        // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
        var u = azimuth(point) / 2 / Math.PI + 0.5;
        var v = inclination(point) / Math.PI + 0.5;
        var something = vertex;
        something['uv'] = new R2([u, 1 - v]);
        return vertex;
    }
    // Texture fixing helper. Spheres have some odd behaviours.
    function correctUV(uv, vector, azimuth) {
        if ((azimuth < 0) && (uv.x === 1))
            uv = new R2([uv.x - 1, uv.y]);
        if ((vector.x === 0) && (vector.z === 0))
            uv = new R2([azimuth / 2 / Math.PI + 0.5, uv.y]);
        return uv.clone();
    }
    /**
     * @class PolyhedronSimplexGeometry
     * @extends SimplexGeometry
     */
    var PolyhedronSimplexGeometry = (function (_super) {
        __extends(PolyhedronSimplexGeometry, _super);
        /**
         * @class PolyhedronSimplexGeometry
         * @constructor
         *
         */
        function PolyhedronSimplexGeometry(vertices, indices, radius, detail) {
            if (radius === void 0) { radius = 1; }
            if (detail === void 0) { detail = 0; }
            _super.call(this);
            var that = this;
            var points = [];
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                prepare(new R3([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
            }
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = points[indices[i]];
                var v2 = points[indices[i + 1]];
                var v3 = points[indices[i + 2]];
                // FIXME: Using some modifications of the data structures given.
                // TODO: Optimize vector copies.
                var simplex = new Simplex(Simplex.TRIANGLE);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = v1;
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v1);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = v2;
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v2);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = v3;
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v3);
                faces[j] = simplex;
            }
            for (var i = 0, facesLength = faces.length; i < facesLength; i++) {
                subdivide(faces[i], detail, points);
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
                points[i].x *= radius;
                points[i].y *= radius;
                points[i].z *= radius;
            }
            // Merge vertices
            this.mergeVertices();
            //    this.computeFaceNormals();
            //    this.boundingSphere = new Sphere(new R3([0, 0, 0]), radius);
            function centroid(v1, v2, v3) {
                var x = (v1.x + v2.x + v3.x) / 3;
                var y = (v1.y + v2.y + v3.y) / 3;
                var z = (v1.z + v2.z + v3.z) / 3;
                return new Euclidean3(0, x, y, z, 0, 0, 0, 0);
            }
            // Approximate a curved face with recursively sub-divided triangles.
            function make(v1, v2, v3) {
                var azi = azimuth(centroid(v1, v2, v3));
                var something1 = v1;
                var something2 = v2;
                var something3 = v3;
                var uv1 = correctUV(something1['uv'], v1, azi);
                var uv2 = correctUV(something2['uv'], v2, azi);
                var uv3 = correctUV(something3['uv'], v3, azi);
                var simplex = new Simplex(Simplex.TRIANGLE);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = R3.copy(v1);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v1);
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv1;
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = R3.copy(v2);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v2);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv2;
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = R3.copy(v3);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = R3.copy(v3);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv3;
                that.data.push(simplex);
            }
            // Analytically subdivide a face to the required detail level.
            function subdivide(face, detail, points) {
                var cols = Math.pow(2, detail);
                var a = prepare(face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION], points);
                var b = prepare(face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION], points);
                var c = prepare(face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION], points);
                var v = [];
                // Construct all of the vertices for this subdivision.
                for (var i = 0; i <= cols; i++) {
                    v[i] = [];
                    var aj = prepare(R3.copy(a).lerp(c, i / cols), points);
                    var bj = prepare(R3.copy(b).lerp(c, i / cols), points);
                    var rows = cols - i;
                    for (var j = 0; j <= rows; j++) {
                        if (j == 0 && i == cols) {
                            v[i][j] = aj;
                        }
                        else {
                            v[i][j] = prepare(R3.copy(aj).lerp(bj, j / rows), points);
                        }
                    }
                }
                // Construct all of the faces.
                for (var i = 0; i < cols; i++) {
                    for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                        var k = Math.floor(j / 2);
                        if (j % 2 == 0) {
                            make(v[i][k + 1], v[i + 1][k], v[i][k]);
                        }
                        else {
                            make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]);
                        }
                    }
                }
            }
        }
        return PolyhedronSimplexGeometry;
    })(SimplexGeometry);
    return PolyhedronSimplexGeometry;
});
