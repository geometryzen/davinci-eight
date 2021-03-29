import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';

/**
 * Scratch variables to avoid creating temporary objects.
 */
/**
 * @hidden
 */
const a = Vector3.zero();
/**
 * @hidden
 */
const b = Vector3.zero();

// Angle around the Y axis, counter-clockwise when looking from above.
/**
 * @hidden
 */
function azimuth(vector: VectorE3): number {
    return Math.atan2(vector.z, -vector.x);
}

// Angle above the XZ plane.
/**
 * @hidden
 */
function inclination(pos: VectorE3): number {
    return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
}

/**
 * Modifies the incoming point by projecting it onto the unit sphere.
 * Add the point to the array of points
 * Sets a hidden `index` property to the index in `points`
 * Computes the texture coordinates and sticks them in the hidden `uv` property as a Vector2.
 * OK!
 * @hidden
 */
function prepare(point: VectorE3, points: Vector3[]): VectorE3 {
    // Copy the point and project it onto the unit sphere.
    const vertex: Vector3 = Vector3.copy(point).normalize();
    points.push(vertex);
    // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
    const u = azimuth(point) / 2 / Math.PI + 0.5;
    const v = inclination(point) / Math.PI + 0.5;
    const something: any = vertex;
    // This is a bit ugly from a type-safety perspective.
    // We could avoid it by working with a Vertex object instead.
    something['uv'] = new Vector2([u, 1 - v]);
    return vertex;
}

// Texture fixing helper.
/**
 * @hidden
 */
function correctUV(uv: Vector2, vector: VectorE3, azimuth: number): Vector2 {
    if ((azimuth < 0) && (uv.x === 1)) uv = new Vector2([uv.x - 1, uv.y]);
    if ((vector.x === 0) && (vector.z === 0)) uv = new Vector2([azimuth / 2 / Math.PI + 0.5, uv.y]);
    return uv.clone();
}

/**
 * Computes the normal associated with the three position vectors taken to represent a triangle with CCW-outside orientation.
 * @hidden
 */
function normal(v1: VectorE3, v2: VectorE3, v3: VectorE3): Vector3 {
    a.copy(v2).sub(v1);
    b.copy(v3).sub(v2);
    return Vector3.copy(a).cross(b).normalize();
}

/**
 * In elementary geometry, a polyhedron is a solid in three dimensions with
 * flat polygonal faces, straight edges and sharp corners or vertices.
 * @hidden
 */
export class PolyhedronBuilder extends SimplexPrimitivesBuilder {

    /**
     * 
     * param vertices {number} An array of 3 * N numbers representing N vertices.
     * param indices {number} An array of 3 * M numbers representing M triangles.
     *
     * param radius The distance of the polyhedron points from the origin.
     * param detail The number of times to subdivide the triangles in the faces.
     */
    constructor(vertices: number[], indices: number[], radius = 1, detail = 0) {
        super();

        const points: Vector3[] = [];

        // Normalize the vertices onto a unit sphere, compute UV coordinates and return the points.
        for (let i = 0, l = vertices.length; i < l; i += 3) {
            prepare(new Vector3([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
        }

        const faces: Simplex[] = [];

        // Compute the Simplex faces, as given by the triples of indices.
        for (let i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
            const v1: Vector3 = points[indices[i]];
            const v2: Vector3 = points[indices[i + 1]];
            const v3: Vector3 = points[indices[i + 2]];

            const n = normal(v1, v2, v3);

            const simplex = new Simplex(SimplexMode.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v1;
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v2;
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = v3;
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            faces[j] = simplex;
        }

        // Further subdivide the faces if more detail is required.
        for (let i = 0, facesLength = faces.length; i < facesLength; i++) {
            subdivide(faces[i], detail, points, this);
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
        for (let i = 0, verticesLength = points.length; i < verticesLength; i++) {
            points[i].scale(radius);
        }

        // Merge vertices
        this.mergeVertices();

        function centroid(v1: VectorE3, v2: VectorE3, v3: VectorE3): VectorE3 {
            const x = (v1.x + v2.x + v3.x) / 3;
            const y = (v1.y + v2.y + v3.y) / 3;
            const z = (v1.z + v2.z + v3.z) / 3;
            return { x, y, z };
        }


        // Approximate a curved face with recursively sub-divided triangles.
        function make(v1: VectorE3, v2: VectorE3, v3: VectorE3, builder: SimplexPrimitivesBuilder) {

            const azi: number = azimuth(centroid(v1, v2, v3));
            const something1: any = v1;
            const something2: any = v2;
            const something3: any = v3;

            // This is a bit ugly from a type-safety perspective.
            const uv1 = correctUV(something1['uv'], v1, azi);
            const uv2 = correctUV(something2['uv'], v2, azi);
            const uv3 = correctUV(something3['uv'], v3, azi);

            const n = normal(v1, v2, v3);

            const simplex = new Simplex(SimplexMode.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(v1);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv1;
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(v2);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv2;
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(v3);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = Vector3.copy(n);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uv3;
            builder.data.push(simplex);
        }

        // Subdivide a face to the required detail level.
        function subdivide(face: Simplex, detail: number, points: Vector3[], builder: SimplexPrimitivesBuilder) {

            const cols = Math.pow(2, detail);
            const a: VectorE3 = prepare(<Vector3>face.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            const b: VectorE3 = prepare(<Vector3>face.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            const c: VectorE3 = prepare(<Vector3>face.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION], points);
            const v: VectorE3[][] = [];

            // Construct all of the vertices for this subdivision.

            for (let i = 0; i <= cols; i++) {

                v[i] = [];

                const aj: VectorE3 = prepare(Vector3.copy(a).lerp(c, i / cols), points);
                const bj: VectorE3 = prepare(Vector3.copy(b).lerp(c, i / cols), points);
                const rows = cols - i;

                for (let j = 0; j <= rows; j++) {

                    if (j === 0 && i === cols) {
                        v[i][j] = aj;
                    }
                    else {
                        v[i][j] = prepare(Vector3.copy(aj).lerp(bj, j / rows), points);
                    }

                }

            }

            // Construct all of the faces.
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < 2 * (cols - i) - 1; j++) {
                    const k = Math.floor(j / 2);
                    if (j % 2 === 0) {
                        make(v[i][k + 1], v[i + 1][k], v[i][k], builder);
                    }
                    else {
                        make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k], builder);
                    }
                }
            }
        }
    }

    protected regenerate(): void {
        // Ignore, we shouldn't but we do.
    }
}
