import Cartesian2 = require('../math/Cartesian2')
import Cartesian3 = require('../math/Cartesian3')
import Simplex = require('../geometries/Simplex')
import Geometry = require('../geometries/Geometry')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')
import expectArg = require('../checks/expectArg')
import mustBeFunction = require('../checks/mustBeFunction')
import mustBeInteger = require('../checks/mustBeInteger')
/**
 * @class SurfaceGeometry
 */
class SurfaceGeometry extends Geometry {
  /**
   * @class SurfaceGeometry
   * @constructor
   * @param parametricFunction {(u: number, v: number) => Cartesian3}
   * @param uSegments {number}
   * @param vSegments {number}
   */
  constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number) {
    super();
    mustBeFunction('parametricFunction', parametricFunction)
    mustBeInteger('uSegments', uSegments)
    mustBeInteger('vSegments', vSegments)
    /**
     * Temporary array of points.
     */
    let points: Vector3[] = [];

    var i: number;
    var j: number;

    let sliceCount = uSegments + 1;

    for ( i = 0; i <= vSegments; i ++ ) {

      let v: number = i / vSegments;

      for ( j = 0; j <= uSegments; j ++ ) {

        let u: number = j / uSegments;

        let point: Cartesian3 = parametricFunction( u, v );
        // Make a copy just in case the function is returning mutable references.
        points.push(Vector3.copy(point));
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

        var simplex = new Simplex(Simplex.TRIANGLE)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a]
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uva
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d]
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd
        this.data.push(simplex)

        var simplex = new Simplex(Simplex.TRIANGLE)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b]
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvc
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d]
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd
        this.data.push(simplex)
      }
    }

//    this.computeFaceNormals();
//    this.computeVertexNormals();
  }
}

export = SurfaceGeometry;
