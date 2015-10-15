import Cartesian3 = require('../math/Cartesian3')
import Euclidean3 = require('../math/Euclidean3')
import Geometry = require('../geometries/Geometry')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import Simplex = require('../geometries/Simplex')
import Spinor3 = require('../math/Spinor3')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

function perpendicular(to: Cartesian3): Euclidean3 {
  var random = new Vector3([Math.random(), Math.random(), Math.random()])
  random.cross(to).normalize()
  return new Euclidean3(0, random.x, random.y, random.z, 0, 0, 0, 0)
}

/**
 * @class VortexGeometry
 */
class VortexGeometry extends Geometry {

  public radius: number = 1;
  public radiusCone: number = 0.08;
  public radiusShaft: number = 0.01;
  public lengthCone: number = 0.2;
  public lengthShaft: number = 0.8;
  public arrowSegments: number = 8;
  public radialSegments: number = 12;
  public generator: Spinor3 = new Spinor3([0, 0, 1, 0]);
  /**
   * @class VortexGeometry
   * @constructor
   * @param type [string = 'VortexGeometry']
   */
  constructor(type: string = 'VortexGeometry') {
    super(mustBeString('type', type))
    this.setModified(true)
  }

  public isModified(): boolean {
    return this.generator.modified
  }
  /**
   * @method setModified
   * @param modified {boolean}
   * @return {ArrowGeometry}
   */
  public setModified(modified: boolean): VortexGeometry {
    this.generator.modified = modified
    return this
  }
  /**
   * @method regenerate
   * @return {void}
   */
  regenerate(): void {

    this.data = []

    var radius  =  this.radius
    var radiusCone = this.radiusCone
    var radiusShaft = this.radiusShaft
    var radialSegments = this.radialSegments
    var axis: Euclidean3 = new Euclidean3(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0)
    var radial: Euclidean3 = perpendicular(axis)
    // FIXME: Change to scale
    var R0: Euclidean3 = radial.scalarMultiply(this.radius)
    var generator = new Euclidean3(this.generator.w, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0)
    var Rminor0: Euclidean3 = axis.wedge(radial)

    var n = 9;
    var circleSegments = this.arrowSegments * n;

    var tau = Math.PI * 2;
    var center = new Vector3([0, 0, 0]);

    var normals: Vector3[] = [];
    var points: Vector3[] = [];
    var uvs: Vector2[] = [];

    var alpha = this.lengthShaft / (this.lengthCone + this.lengthShaft);
    var factor = tau / this.arrowSegments;
    var theta = alpha / (n - 2);

    function computeAngle(index: number): number {
      mustBeInteger('index', index)
      var m = index % n;
      if (m === n - 1) {
        return computeAngle(index - 1);
      }
      else {
        var a = (index - m)/n;
        return factor * (a + m * theta);
      }
    }

    function computeRadius(index: number): number {
      mustBeInteger('index', index)
      var m = index % n;
      if (m === n - 1) {
        return radiusCone;
      }
      else {
        return radiusShaft;
      }
    }

    for ( var j = 0; j <= radialSegments; j++ ) {

      // v is the angle inside the vortex tube.
      var v = tau * j / radialSegments;

      for ( var i = 0; i <= circleSegments; i++ ) {

        // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
        var u = computeAngle(i)

        var Rmajor: Euclidean3 = generator.scalarMultiply(-u/2).exp()

        center.copy(R0).rotate(Rmajor)

        var vertex = Vector3.copy(center)
        var r0: Euclidean3 = axis.scalarMultiply(computeRadius(i))

        var Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scalarMultiply(-v/2).exp()

        // var Rminor = Rminor0.clone().rotate(Rmajor).scale(-v/2).exp()

        var r: Euclidean3 = Rminor.mul(r0).mul(Rminor.__tilde__())

        vertex.sum(center, r)

        points.push( vertex );

        uvs.push(new Vector2([i / circleSegments, j / radialSegments]));
        normals.push( Vector3.copy(r).normalize() );
      }
    }

    for ( var j = 1; j <= radialSegments; j++ ) {

      for ( var i = 1; i <= circleSegments; i++ ) {

        var a = ( circleSegments + 1 ) * j + i - 1;
        var b = ( circleSegments + 1 ) * ( j - 1 ) + i - 1;
        var c = ( circleSegments + 1 ) * ( j - 1 ) + i;
        var d = ( circleSegments + 1 ) * j + i;

        var face = new Simplex(Simplex.K_FOR_TRIANGLE)

        face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[a]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[a].clone()

        face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[b]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[b].clone()

        face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[d].clone()

        this.data.push(face)

        var face = new Simplex(Simplex.K_FOR_TRIANGLE)

        face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[b]
        face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[b].clone()

        face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[c]
        face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[c].clone()

        face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[d]
        face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[d].clone()

        this.data.push(face)
      }
    }
    this.setModified(false)
  }
}

export = VortexGeometry;
