import Cartesian2 = require('../math/Cartesian2')
import Cartesian3 = require('../math/Cartesian3')
import Geometry = require('../geometries/Geometry')
import Simplex = require('../geometries/Simplex')
import Sphere = require('../math/Sphere')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

// Angle around the Y axis, counter-clockwise when looking from above.
function azimuth( vector: Cartesian3 ): number {
  return Math.atan2(vector.z, -vector.x);
}

// Angle above the XZ plane.
function inclination(pos: Cartesian3): number {
  return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
}

/**
 * Modifies the incoming point by projecting it onto the unit sphere.
 * Add the point to the array of points
 * Sets a hidden `index` property to the index in `points`
 * Computes the texture coordinates and sticks them in the hidden `uv` property as a Vector2.
 * OK!
 */
function prepare(point: Cartesian3, points: Vector3[]): Cartesian3 {
  let vertex: Vector3 = Vector3.copy(point).normalize()
  points.push(vertex)
  // Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
  let u = azimuth( point ) / 2 / Math.PI + 0.5;
  let v = inclination( point ) / Math.PI + 0.5;
  var something: any = vertex
  something['uv'] = new Vector2([u, 1 - v]);
  return vertex;
}

// Texture fixing helper. Spheres have some odd behaviours.
function correctUV( uv: Vector2, vector: Cartesian3, azimuth: number ): Vector2 {
  if ( ( azimuth < 0 ) && ( uv.x === 1 ) ) uv = new Vector2([uv.x - 1, uv.y]);
  if ( ( vector.x === 0 ) && ( vector.z === 0 ) ) uv = new Vector2([azimuth / 2 / Math.PI + 0.5, uv.y]);
  return uv.clone();
}

/**
 * @class PolyhedronGeometry
 * @extends Geometry
 */
class PolyhedronGeometry extends Geometry {
  /**
   * @class PolyhedronGeometry
   * @constructor
   * 
   */
  constructor(vertices: number[], indices: number[], radius: number = 1, detail: number = 0) {
    super();

    var that = this;

    var points: Vector3[] = []

    for ( var i = 0, l = vertices.length; i < l; i += 3 ) {
      prepare(new Vector3([vertices[i], vertices[i + 1], vertices[i + 2]]), points)
    }

    var faces: Simplex[] = [];

    for ( var i = 0, j = 0, l = indices.length; i < l; i += 3, j++ ) {

      var v1 = points[ indices[ i     ] ];
      var v2 = points[ indices[ i + 1 ] ];
      var v3 = points[ indices[ i + 2 ] ];

      // FIXME: Using some modifications of the data structures given.
      // TODO: Optimize vector copies.
      var simplex = new Simplex(Simplex.TRIANGLE)
      simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = v1
      simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = Vector3.copy(v1)
      simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = v2
      simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = Vector3.copy(v2)
      simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = v3
      simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = Vector3.copy(v3)
      faces[j] = simplex
    }

    for ( var i = 0, facesLength = faces.length; i < facesLength; i ++ ) {

      subdivide( faces[ i ], detail, points);

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

    for ( var i = 0, verticesLength = points.length; i < verticesLength; i ++ ) {
      points[i].x *= radius;
      points[i].y *= radius;
      points[i].z *= radius;
    }


    // Merge vertices

    this.mergeVertices();

//    this.computeFaceNormals();

//    this.boundingSphere = new Sphere(new Vector3([0, 0, 0]), radius);


    function centroid(v1: Cartesian3, v2: Cartesian3, v3: Cartesian3): Cartesian3 {
      let x = (v1.x + v2.x + v3.x) / 3;
      let y = (v1.y + v2.y + v3.y) / 3;
      let z = (v1.z + v2.z + v3.z) / 3;
      return { x: x, y: y, z: z };
    }


    // Approximate a curved face with recursively sub-divided triangles.

    function make( v1: Cartesian3, v2: Cartesian3, v3: Cartesian3 ) {

      var azi: number = azimuth(centroid(v1, v2, v3));
      var something1: any = v1
      var something2: any = v2
      var something3: any = v3

      var uv1 = correctUV(something1['uv'], v1, azi);
      var uv2 = correctUV(something2['uv'], v2, azi);
      var uv3 = correctUV(something3['uv'], v3, azi);

      var simplex = new Simplex(Simplex.TRIANGLE)
      simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = Vector3.copy(v1)
      simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = Vector3.copy(v1)
      simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv1
      simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = Vector3.copy(v2)
      simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = Vector3.copy(v2)
      simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv2
      simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = Vector3.copy(v3)
      simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = Vector3.copy(v3)
      simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv3
      that.data.push(simplex)
    }

    // Analytically subdivide a face to the required detail level.

    function subdivide(face: Simplex, detail: number, points: Vector3[]) {

      var cols = Math.pow(2, detail);
      var a: Cartesian3 = prepare( <Vector3>face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION], points );
      var b: Cartesian3 = prepare( <Vector3>face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION], points );
      var c: Cartesian3 = prepare( <Vector3>face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION], points );
      var v: Cartesian3[][] = [];

      // Construct all of the vertices for this subdivision.

      for ( var i = 0 ; i <= cols; i ++ ) {

        v[ i ] = [];

        var aj: Cartesian3 = prepare( Vector3.copy(a).lerp( c, i / cols ), points);
        var bj: Cartesian3 = prepare( Vector3.copy(b).lerp( c, i / cols ), points);
        var rows = cols - i;

        for ( var j = 0; j <= rows; j ++) {

          if ( j == 0 && i == cols ) {
            v[ i ][ j ] = aj;
          }
          else {
            v[ i ][ j ] = prepare(Vector3.copy(aj).lerp(bj, j / rows), points);
          }

        }

      }

      // Construct all of the faces.

      for ( var i = 0; i < cols ; i ++ ) {
        for ( var j = 0; j < 2 * (cols - i) - 1; j ++ ) {
          var k = Math.floor( j / 2 );
          if ( j % 2 == 0 ) {
            make(v[ i ][ k + 1], v[ i + 1 ][ k ], v[ i ][ k ]);
          }
          else {
            make(v[ i ][ k + 1 ], v[ i + 1][ k + 1], v[ i + 1 ][ k ]);
          }
        }
      }
    }
  }
}

export = PolyhedronGeometry;
