import Cartesian3 = require('../math/Cartesian3')
import Geometry = require('../geometries/Geometry')
import Simplex = require('../geometries/Simplex')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

/**
 * @class RingGeometry
 * @extends Geometry
 */
class RingGeometry extends Geometry
{
  /**
   * The outer radius.
   * @property a
   * @type {number}
   */
  public a: number;
  /**
   * The inner radius.
   * @property b
   * @type {number}
   */
  public b: number;
  /**
   * The axis of symmetry.
   * @property e
   * @type {Vector3}
   */
  public e: Vector3;
  public radialSegments: number;
  public thetaSegments: number;
  public thetaStart: number;
  public thetaLength: number;
  /**
   * Creates an annulus with a single hole.
   * @class RingGeometry
   * @constructor
   */
  constructor(a: number = 1, b: number = 0, e: Cartesian3 = Vector3.e3)
  {
    super('RingGeometry')
    this.a = a
    this.b = b
    this.e = Vector3.copy(e)
    this.radialSegments = 8
    this.thetaSegments = 8
    this.thetaStart = 0
    this.thetaLength = 2 * Math.PI
  }
  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void
  {
    super.destructor()
  }
  /**
   * @method isModified
   * @return {boolean}
   */
  public isModified(): boolean
  {
    return super.isModified();
  }
  /**
   * @method recalculate
   * @return {void}
   */
  public recalculate(): void
  {
    this.data = []

    var radialSegments = this.radialSegments
    var thetaSegments = this.thetaSegments
    var thetaStart = this.thetaStart
    var thetaLength = this.thetaLength
    var a = this.a
    var b = this.b

    var vertices: Vector3[] = []
    var uvs: Vector2[] = []

    var radius = this.b
    var radiusStep = (a - b) / radialSegments

    for (var i = 0; i < radialSegments + 1; i++)
    {
      for (var j = 0; j < thetaSegments + 1; j++)
      {
        var vertex = new Vector3()
        var theta = thetaStart + j / thetaSegments * thetaLength
        vertex.x = radius * Math.cos(theta)
        vertex.y = radius * Math.sin(theta)
        vertices.push(vertex)
        uvs.push(new Vector2([(vertex.x / a + 1) / 2, (vertex.y / a + 1) / 2]))
      }
      radius += radiusStep;
    }

    var n = Vector3.e3.clone()

    for ( i = 0; i < radialSegments; i ++ ) {

      var thetaSegment = i * ( thetaSegments + 1 );

      for ( j = 0; j < thetaSegments ; j++ ) {
        // number of segments per circle

        var segment = j + thetaSegment;

        var v1 = segment;
        var v2 = segment + thetaSegments + 1;
        var v3 = segment + thetaSegments + 2;

        var simplex = new Simplex(Simplex.K_FOR_TRIANGLE)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v1]
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v1].clone()

        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v2]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v2].clone()
        
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v3]
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v3].clone()
        this.data.push(simplex)

        v1 = segment;
        v2 = segment + thetaSegments + 2;
        v3 = segment + 1;

        var simplex = new Simplex(Simplex.K_FOR_TRIANGLE)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v1]
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v1].clone()

        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v2]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v2].clone()
        
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[v3]
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[v3].clone()
        this.data.push(simplex)
      }
    }
    this.setModified(false)
  }
  /**
   * @method setModified
   * @param modified {boolean}
   * @return {RingGeometry}
   * @chainable
   */
  public setModified(modified: boolean): RingGeometry
  {
    return this;
  }
}

export = RingGeometry