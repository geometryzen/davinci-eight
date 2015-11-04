/**
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 * @author jonobr1 / https://github.com/jonobr1
 *
 * Modified from the TorusKnotGeometry by @oosmoxiecode
 *
 * Creates a tube which extrudes along a 3d spline
 *
 * Uses parallel transport frames as described in
 * http://www.cs.indiana.edu/pub/techreports/TR425.pdf
 */
import clamp = require('../math/clamp');
import Curve = require('../curves/Curve');
import Face3 = require('../core/Face3');
import SimplexGeometry = require('../geometries/SimplexGeometry');
import Matrix4 = require('../math/Matrix4');
import R2 = require('../math/R2');
import R3 = require('../math/R3');

class TubeSimplexGeometry extends SimplexGeometry {
  public static NoTaper = function (u: number): number {return 1;};
  public static SinusoidalTaper = function (u: number): number {return Math.sin(Math.PI * u);};
  public tangents: R3[];
  public normals: R3[];
  public binormals: R3[];
  constructor(path: Curve, segments?: number, radius?: number, radialSegments?: number, closed?: boolean, taper?: (u: number)=>number) {
    super();
    segments = segments || 64;
    radius = radius || 0.05;
    radialSegments = radialSegments || 16;
    closed = closed || false;
    taper = taper || TubeSimplexGeometry.NoTaper;

    var grid: number[][] = [];

    var scope = this;
    var tangent: R3;
    var normal: R3;
    var binormal: R3;
    var numpoints = segments + 1;

    var u: number;
    var v: number;
    var r: number;

    var cx: number;
    var cy: number;
    var pos: R3;
    var pos2: R3 = new R3([0, 0, 0]);
    var i: number;
    var j: number;
    var ip: number;
    var jp: number;
    var a: number;
    var b: number;
    var c: number;
    var d: number;
    var uva: R2;
    var uvb: R2;
    var uvc: R2;
    var uvd: R2;

    var frames = new FrenetFrames(path, segments, closed);
    var tangents = frames.tangents;
    var normals = frames.normals;
    var binormals = frames.binormals;

    // proxy internals
    this.tangents = tangents;
    this.normals = normals;
    this.binormals = binormals;

    function vert(x: number, y: number, z: number) {
      return scope.vertices.push(new R3([x, y, z])) - 1;
    }

    // consruct the grid

    for ( i = 0; i < numpoints; i ++ ) {

      grid[ i ] = [];

      u = i / ( numpoints - 1 );

      pos = path.getPointAt( u );

      tangent = tangents[ i ];
      normal = normals[ i ];
      binormal = binormals[ i ];

      r = radius * taper( u );

      for ( j = 0; j < radialSegments; j ++ ) {

        v = j / radialSegments * 2 * Math.PI;

        cx = - r * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
        cy = r * Math.sin( v );

        pos2.copy( pos );
        pos2.x += cx * normal.x + cy * binormal.x;
        pos2.y += cx * normal.y + cy * binormal.y;
        pos2.z += cx * normal.z + cy * binormal.z;

        grid[ i ][ j ] = vert( pos2.x, pos2.y, pos2.z );

      }
    }

    for ( i = 0; i < segments; i ++ ) {

      for ( j = 0; j < radialSegments; j ++ ) {

        ip = ( closed ) ? (i + 1) % segments : i + 1;
        jp = (j + 1) % radialSegments;

        a = grid[ i ][ j ];    // *** NOT NECESSARILY PLANAR ! ***
        b = grid[ ip ][ j ];
        c = grid[ ip ][ jp ];
        d = grid[ i ][ jp ];

        uva = new R2([i / segments, j / radialSegments]);
        uvb = new R2([( i + 1 ) / segments, j / radialSegments]);
        uvc = new R2([( i + 1 ) / segments, ( j + 1 ) / radialSegments]);
        uvd = new R2([i / segments, ( j + 1 ) / radialSegments]);

        this.faces.push( new Face3( a, b, d ) );
        this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

        this.faces.push( new Face3( b, c, d ) );
        this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

      }
    }

    this.computeFaceNormals();
    this.computeVertexNormals();
  }
}

export = TubeSimplexGeometry;

// For computing of Frenet frames, exposing the tangents, normals and binormals the spline
class FrenetFrames {
  public tangents: R3[];
  public normals: R3[];
  public binormals: R3[];
  constructor(path: Curve, segments: number, closed: boolean) {
    var normal = new R3([0, 0, 0]);
    var tangents: R3[] = [];
    var normals: R3[] = [];
    var binormals: R3[] = [];

    var vec = new R3([0, 0, 0]);
    var mat = Matrix4.one();

    var numpoints: number = segments + 1;
    var theta: number;
    let epsilon = 0.0001;
    let epsilonSquared = 0.0001 * 0.0001;
    var smallest: number;

    // TODO: The folloowing should be a R3
    var tx: number;
    var ty: number;
    var tz: number;
    var i: number;
    var u: number;


    // expose internals
    this.tangents = tangents;
    this.normals = normals;
    this.binormals = binormals;

    // compute the tangent vectors for each segment on the path

    for (i = 0; i < numpoints; i++) {

        u = i / (numpoints - 1);

        tangents[i] = path.getTangentAt(u);
        tangents[i].normalize();

    }

    initialNormal3();

    /*
    function initialNormal1(lastBinormal) {
      // fixed start binormal. Has dangers of 0 vectors
      normals[ 0 ] = new R3();
      binormals[ 0 ] = new R3();
      if (lastBinormal===undefined) lastBinormal = new R3( 0, 0, 1 );
      normals[ 0 ].cross2( lastBinormal, tangents[ 0 ] ).normalize();
      binormals[ 0 ].cross2( tangents[ 0 ], normals[ 0 ] ).normalize();
    }
    function initialNormal2() {
      // This uses the Frenet-Serret formula for deriving binormal
      var t2 = path.getTangentAt( epsilon );
      normals[ 0 ] = new R3().difference( t2, tangents[ 0 ] ).normalize();
      binormals[ 0 ] = new R3().cross2( tangents[ 0 ], normals[ 0 ] );
      normals[ 0 ].cross2( binormals[ 0 ], tangents[ 0 ] ).normalize(); // last binormal x tangent
      binormals[ 0 ].cross2( tangents[ 0 ], normals[ 0 ] ).normalize();
    }
    */

    function initialNormal3() {
        // select an initial normal vector perpendicular to the first tangent vector,
        // and in the direction of the smallest tangent component

        normals[0] = new R3([0, 0, 0]);
        binormals[0] = new R3([0, 0, 0]);
        smallest = Number.MAX_VALUE;
        tx = Math.abs(tangents[0].x);
        ty = Math.abs(tangents[0].y);
        tz = Math.abs(tangents[0].z);

        if (tx <= smallest) {
            smallest = tx;
            normal.set(1, 0, 0);
        }

        if (ty <= smallest) {
            smallest = ty;
            normal.set(0, 1, 0);
        }

        if (tz <= smallest) {
            normal.set(0, 0, 1);
        }

        vec.cross2(tangents[0], normal).normalize();

        normals[0].cross2(tangents[0], vec);
        binormals[0].cross2(tangents[0], normals[0]);
    }


    // compute the slowly-varying normal and binormal vectors for each segment on the path

    for (i = 1; i < numpoints; i++) {

        normals[i] = normals[i - 1].clone();

        binormals[i] = binormals[i - 1].clone();

        vec.cross2(tangents[i - 1], tangents[i]);

        if (vec.magnitude() > epsilon) {

            vec.normalize();

            theta = Math.acos(clamp(tangents[i - 1].dot(tangents[i]), - 1, 1)); // clamp for floating pt errors

            // TODO: don't like this applyMatrix4 use applySpinor
            normals[i].applyMatrix4(mat.rotationAxis(vec, theta));

        }

        binormals[i].cross2(tangents[i], normals[i]);

    }


    // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

    if (closed) {

        theta = Math.acos(clamp(normals[0].dot(normals[numpoints - 1]), - 1, 1));
        theta /= (numpoints - 1);

        if (tangents[0].dot(vec.cross2(normals[0], normals[numpoints - 1])) > 0) {

            theta = - theta;

        }

        for (i = 1; i < numpoints; i++) {

            // twist a little...
            // TODO: Don't like this applyMatrix4 use applySpinor
            normals[i].applyMatrix4(mat.rotationAxis(tangents[i], theta * i));
            binormals[i].cross2(tangents[i], normals[i]);

        }

    }
  }
}