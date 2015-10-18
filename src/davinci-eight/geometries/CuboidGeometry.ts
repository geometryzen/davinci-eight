import cannotAssignTypeToProperty = require('../i18n/cannotAssignTypeToProperty')
import Cartesian3 = require('../math/Cartesian3')
import computeFaceNormals = require('../geometries/computeFaceNormals')
import feedback = require('../feedback/feedback')
import Geometry = require('../geometries/Geometry')
import isObject = require('../checks/isObject')
import isUndefined = require('../checks/isUndefined')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import quad = require('../geometries/quadrilateral')
import readOnly = require('../i18n/readOnly')
import Simplex = require('../geometries/Simplex')
import Symbolic = require('../core/Symbolic')
import triangle = require('../geometries/triangle')
import MutableNumber = require('../math/MutableNumber')
import Vector3 = require('../math/Vector3')
import VectorN = require('../math/VectorN')

/**
 * @class CuboidGeometry
 * @extends Geometry
 */
class CuboidGeometry extends Geometry {
  /**
   * Parameter is private so that we can detect assignments.
   * @property _a
   * @type {Vector3}
   * @private
   */
  private _a: Vector3;
  /**
   * Parameter is private so that we can detect assignments.
   * @property _b
   * @type {Vector3}
   * @private
   */
  private _b: Vector3;
  /**
   * Parameter is private so that we can detect assignments.
   * @property _c
   * @type {Vector3}
   * @private
   */
  private _c: Vector3;
  /**
   * Used to mark the parameters of this object dirty when they are possibly shared.
   * @property _isModified
   * @type {boolean}
   * @private
   */
  private _isModified: boolean = true;
  /**
   * <p>
   * The <code>CuboidGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
   * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
   * The property <code>k</code> represents the dimensionality of the vertices.
   * The default settings create a unit cube centered at the origin.
   * </p>
   * @class CuboidGeometry
   * @constructor
   * @param a [Cartesian3 = Vector3.e1]
   * @param b [Cartesian3 = Vector3.e1]
   * @param c [Cartesian3 = Vector3.e1]
   * @param k [number = Simplex.TRIANGLE]
   * @param subdivide [number = 0]
   * @param boundary [number = 0]
   * @example
       var geometry = new EIGHT.CuboidGeometry();
       var elements = geometry.toElements();
       var material = new EIGHT.LineMaterial();
       var cube = new EIGHT.Drawable(elements, material);
   */
  constructor(a: Cartesian3 = Vector3.e1, b: Cartesian3 = Vector3.e2, c: Cartesian3 = Vector3.e3, k: number = Simplex.TRIANGLE, subdivide: number = 0, boundary: number = 0)
  {
    super('CuboidGeometry')
    this.a = Vector3.copy(a)
    this.b = Vector3.copy(b)
    this.c = Vector3.copy(c)
    this.k = k
    this.subdivide(subdivide)
    this.boundary(boundary)
    this.regenerate();
  }
  protected destructor(): void {
    super.destructor();
  }
  /**
   * <p>
   * A vector parameterizing the shape of the cuboid.
   * Defaults to the standard basis vector e1.
   * Assignment is by reference making it possible for parameters to be shared references.
   * </p>
   * @property a
   * @type {Vector3}
   */
  public get a(): Vector3 {
    return this._a
  }
  public set a(a: Vector3) {
    if (a instanceof Vector3) {
      this._a = a
      this._isModified = true
    }
    else {
      feedback.warn(cannotAssignTypeToProperty(typeof a, 'a'))
    }
  }
  /**
   * <p>
   * A vector parameterizing the shape of the cuboid.
   * Defaults to the standard basis vector e2.
   * Assignment is by reference making it possible for parameters to be shared references.
   * </p>
   * @property b
   * @type {Vector3}
   */
  public get b(): Vector3 {
    return this._b
  }
  public set b(b: Vector3) {
    if (b instanceof Vector3) {
      this._b = b
      this._isModified = true
    }
    else {
      feedback.warn(cannotAssignTypeToProperty(typeof b, 'b'))
    }
  }
  /**
   * <p>
   * A vector parameterizing the shape of the cuboid.
   * Defaults to the standard basis vector e3.
   * Assignment is by reference making it possible for parameters to be shared references.
   * </p>
   * @property c
   * @type {Vector3}
   */
  public get c(): Vector3 {
    return this._c
  }
  public set c(c: Vector3) {
    if (c instanceof Vector3) {
      this._c = c
      this._isModified = true
    }
    else {
      feedback.warn(cannotAssignTypeToProperty(typeof c, 'c'))
    }
  }
  public isModified() {
    return this._isModified || this._a.modified || this._b.modified || this._c.modified || super.isModified()
  }
  /**
   * @method setModified
   * @param modified {boolean} The value that the modification state will be set to.
   * @return {CuboidGeometry} `this` instance.
   */
  public setModified(modified: boolean): CuboidGeometry {
    this._isModified = modified
    this._a.modified  = modified
    this._b.modified  = modified
    this._c.modified  = modified
    super.setModified(modified)
    return this
  }
  /**
   * regenerate the geometry based upon the current parameters.
   * @method regenerate
   * @return {void}
   */
  public regenerate(): void {
    this.setModified(false)

    var pos: Vector3[] = [0, 1, 2, 3, 4, 5, 6, 7].map(function(index) {return void 0})
    pos[0] = new Vector3().sub(this._a).sub(this._b).add(this._c).divideScalar(2)
    pos[1] = new Vector3().add(this._a).sub(this._b).add(this._c).divideScalar(2)
    pos[2] = new Vector3().add(this._a).add(this._b).add(this._c).divideScalar(2)
    pos[3] = new Vector3().sub(this._a).add(this._b).add(this._c).divideScalar(2)
    pos[4] = new Vector3().copy(pos[3]).sub(this._c)
    pos[5] = new Vector3().copy(pos[2]).sub(this._c)
    pos[6] = new Vector3().copy(pos[1]).sub(this._c)
    pos[7] = new Vector3().copy(pos[0]).sub(this._c)

    function simplex(indices: number[]): Simplex {
      let simplex = new Simplex(indices.length - 1)
      for (var i = 0; i < indices.length; i++) {
        simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]]
        simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_GEOMETRY_INDEX] = new MutableNumber([i])
      }
      return simplex
    }
    switch(this.k) {
      case 0: {
        var points = [[0],[1],[2],[3],[4],[5],[6],[7]]
        this.data = points.map(function(point) {return simplex(point)})
      }
      break
      case 1: {
        let lines = [[0,1],[1,2],[2,3],[3,0],[0,7],[1,6],[2,5],[3,4],[4,5],[5,6],[6,7],[7,4]]
        this.data = lines.map(function(line) {return simplex(line)})
      }
      break
      case 2: {
        var faces: Simplex[][] = [0, 1, 2, 3, 4, 5].map(function(index) {return void 0})
        faces[0] = quad(pos[0], pos[1], pos[2], pos[3])
        faces[1] = quad(pos[1], pos[6], pos[5], pos[2])
        faces[2] = quad(pos[7], pos[0], pos[3], pos[4])
        faces[3] = quad(pos[6], pos[7], pos[4], pos[5])
        faces[4] = quad(pos[3], pos[2], pos[5], pos[4])
        faces[5] = quad(pos[7], pos[6], pos[1], pos[0])
        this.data = faces.reduce(function(a, b) { return a.concat(b) }, []);

        this.data.forEach(function(simplex) {
          computeFaceNormals(simplex);
        })
      }
      break
      default: {
      }
    }
    // Compute the meta data.
    this.check()
  }
}

export = CuboidGeometry;
