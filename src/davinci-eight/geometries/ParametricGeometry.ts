import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Vector2 = require('../math/Vector2');
/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new ParametricGeometry( parametricFunction, uSegments, vSegments );
 */
class ParametricGeometry extends Geometry {
  constructor(parametricFunction: (u: number, v: number)=>Vector3, uSegments: number, vSegments: number) {
    super();
    var verts: Vector3[] = this.vertices;
    var faces: Face3[] = this.faces;
    var uvs: Vector2[][] = this.faceVertexUvs[ 0 ];

    var i: number;
    var j: number;
    var p: Vector3;
    var u: number;
    var v: number;

    var sliceCount = uSegments + 1;

    for ( i = 0; i <= vSegments; i ++ ) {

      v = i / vSegments;

      for ( j = 0; j <= uSegments; j ++ ) {

        u = j / uSegments;

        p = parametricFunction( u, v );
        verts.push( p );

      }
    }

    var a, b, c, d;
    var uva: Vector2;
    var uvb: Vector2;
    var uvc: Vector2;
    var uvd: Vector2;

    for ( i = 0; i < vSegments; i ++ ) {

      for ( j = 0; j < uSegments; j ++ ) {

        a = i * sliceCount + j;
        b = i * sliceCount + j + 1;
        c = (i + 1) * sliceCount + j + 1;
        d = (i + 1) * sliceCount + j;

        uva = new Vector2( j / uSegments, i / vSegments );
        uvb = new Vector2( ( j + 1 ) / uSegments, i / vSegments );
        uvc = new Vector2( ( j + 1 ) / uSegments, ( i + 1 ) / vSegments );
        uvd = new Vector2( j / uSegments, ( i + 1 ) / vSegments );

        faces.push( new Face3( a, b, d ) );
        uvs.push( [ uva, uvb, uvd ] );

        faces.push( new Face3( b, c, d ) );
        uvs.push( [ uvb.clone(), uvc, uvd.clone() ] );
      }
    }

    this.computeFaceNormals();
    this.computeVertexNormals();
  }
}

export = ParametricGeometry;
