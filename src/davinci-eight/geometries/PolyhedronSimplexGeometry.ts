import VectorE2 from '../math/VectorE2';
import Euclidean3 from '../math/Euclidean3';
import VectorE3 from '../math/VectorE3';
import SimplexGeometry from '../geometries/SimplexGeometry';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R2 from '../math/R2';
import R3 from '../math/R3';

// Angle around the Y axis, counter-clockwise when looking from above.
function azimuth(vector: VectorE3): number {
    return Math.atan2(vector.z, -vector.x);
}

// Angle above the XZ plane.
function inclination(pos: VectorE3): number {
    return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
}

/**
 * Modifies the incoming point by projecting it onto the unit sphere.
 * Add the point to the array of points
 * Sets a hidden `index` property to the index in `points`
 * Computes the texture coordinates and sticks them in the hidden `uv` property as a R2.
 * OK!
 */
function prepare(point: VectorE3, points: R3[]): VectorE3 {
    let vertex: R3 = R3.copy(point).direction()
    points.push(vertex)
    // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
    let u = azimuth(point) / 2 / Math.PI + 0.5;
    let v = inclination(point) / Math.PI + 0.5;
    var something: any = vertex
    something['uv'] = new R2([u, 1 - v]);
    return vertex;
}

// Texture fixing helper.
function correctUV(uv: R2, vector: VectorE3, azimuth: number): R2 {
    if ((azimuth < 0) && (uv.x === 1)) uv = new R2([uv.x - 1, uv.y]);
    if ((vector.x === 0) && (vector.z === 0)) uv = new R2([azimuth / 2 / Math.PI + 0.5, uv.y]);
    return uv.clone();
}

/**
 * @class PolyhedronSimplexGeometry
 * @extends SimplexGeometry
 */
export default class PolyhedronSimplexGeometry extends SimplexGeometry {
    /**
     * @class PolyhedronSimplexGeometry
     * @constructor
     * 
     */
    constructor(vertices: number[], indices: number[], radius: number = 1, detail: number = 0) {
        super();

        var that = this;

        var points: R3[] = []

        for (var i = 0, l = vertices.length; i < l; i += 3) {
            prepare(new R3([vertices[i], vertices[i + 1], vertices[i + 2]]), points)
        }

        var faces: Simplex[] = [];

        for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {

            var v1 = points[indices[i]];
            var v2 = points[indices[i + 1]];
            var v3 = points[indices[i + 2]];

            // FIXME: Using some modifications of the data structures given.
            // TODO: Optimize vector copies.
            var simplex = new Simplex(Simplex.TRIANGLE)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v1
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = R3.copy(v1)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v2
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = R3.copy(v2)
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v3
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = R3.copy(v3)
            faces[j] = simplex
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


        function centroid(v1: VectorE3, v2: VectorE3, v3: VectorE3): VectorE3 {
            let x = (v1.x + v2.x + v3.x) / 3
            let y = (v1.y + v2.y + v3.y) / 3
            let z = (v1.z + v2.z + v3.z) / 3
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0)
        }


        // Approximate a curved face with recursively sub-divided triangles.

        function make(v1: VectorE3, v2: VectorE3, v3: VectorE3) {

            var azi: number = azimuth(centroid(v1, v2, v3));
            var something1: any = v1
            var something2: any = v2
            var something3: any = v3

            var uv1 = correctUV(something1['uv'], v1, azi);
            var uv2 = correctUV(something2['uv'], v2, azi);
            var uv3 = correctUV(something3['uv'], v3, azi);

            var simplex = new Simplex(Simplex.TRIANGLE)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = R3.copy(v1)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = R3.copy(v1)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uv1
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = R3.copy(v2)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = R3.copy(v2)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uv2
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = R3.copy(v3)
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = R3.copy(v3)
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uv3
            that.data.push(simplex)
        }

        // Analytically subdivide a face to the required detail level.

        function subdivide(face: Simplex, detail: number, points: R3[]) {

            var cols = Math.pow(2, detail);
            var a: VectorE3 = prepare(<R3>face.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var b: VectorE3 = prepare(<R3>face.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var c: VectorE3 = prepare(<R3>face.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            var v: VectorE3[][] = [];

            // Construct all of the vertices for this subdivision.

            for (var i = 0; i <= cols; i++) {

                v[i] = [];

                var aj: VectorE3 = prepare(R3.copy(a).lerp(c, i / cols), points);
                var bj: VectorE3 = prepare(R3.copy(b).lerp(c, i / cols), points);
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
}
