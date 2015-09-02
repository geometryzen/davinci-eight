import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new ParametricSurfaceGeometry( parametricFunction, uSegments, vSegments );
 */
class ParametricSurfaceGeometry extends Geometry {
  constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number) {
    super();
    let vertices: Vector3[] = this.vertices;
    let faces: Face3[] = this.faces;
    let uvs: Vector2[][] = this.faceVertexUvs[ 0 ];

    var i: number;
    var j: number;

    let sliceCount = uSegments + 1;

    for ( i = 0; i <= vSegments; i ++ ) {

      let v: number = i / vSegments;

      for ( j = 0; j <= uSegments; j ++ ) {

        let u: number = j / uSegments;

        let p: Cartesian3 = parametricFunction( u, v );
        vertices.push(new Vector3([p.x, p.y, p.z]));

      }
    }

    var a: number;
    var b: number;
    var c: number;
    var d: number;
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

        uva = new Vector2([j / uSegments, i / vSegments]);
        uvb = new Vector2([(j + 1) / uSegments, i / vSegments]);
        uvc = new Vector2([(j + 1) / uSegments, (i + 1) / vSegments]);
        uvd = new Vector2([j / uSegments, (i + 1) / vSegments]);

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

export = ParametricSurfaceGeometry;