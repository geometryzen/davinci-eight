import cannotAssignTypeToProperty = require('../i18n/cannotAssignTypeToProperty')
import computeFaceNormals = require('../geometries/computeFaceNormals')
import Euclidean3 = require('../math/Euclidean3')
import feedback = require('../feedback/feedback')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import isObject = require('../checks/isObject')
import isUndefined = require('../checks/isUndefined')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import quad = require('../geometries/quadrilateral')
import readOnly = require('../i18n/readOnly')
import Simplex = require('../geometries/Simplex')
import Symbolic = require('../core/Symbolic')
import triangle = require('../geometries/triangle')
import R1 = require('../math/R1')
import R3 = require('../math/R3')
import VectorE3 = require('../math/VectorE3')
import VectorN = require('../math/VectorN')

/**
 * @class CuboidSimplexGeometry
 * @extends SimplexGeometry
 */
class CuboidSimplexGeometry extends SimplexGeometry {
  /**
   * Parameter is private so that we can detect assignments.
   * @property _a
   * @type {R3}
   * @private
   */
  private _a: R3;
  /**
   * Parameter is private so that we can detect assignments.
   * @property _b
   * @type {R3}
   * @private
   */
  private _b: R3;
  /**
   * Parameter is private so that we can detect assignments.
   * @property _c
   * @type {R3}
   * @private
   */
  private _c: R3;
  /**
   * Used to mark the parameters of this object dirty when they are possibly shared.
   * @property _isModified
   * @type {boolean}
   * @private
   */
  private _isModified: boolean = true;
  /**
   * <p>
   * The <code>CuboidSimplexGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
   * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
   * The property <code>k</code> represents the dimensionality of the vertices.
   * The default settings create a unit cube centered at the origin.
   * </p>
   * @class CuboidSimplexGeometry
   * @constructor
   * @param a [VectorE3 = R3.e1]
   * @param b [VectorE3 = R3.e1]
   * @param c [VectorE3 = R3.e1]
   * @param k [number = Simplex.TRIANGLE]
   * @param subdivide [number = 0]
   * @param boundary [number = 0]
   * @example
       var geometry = new EIGHT.CuboidSimplexGeometry();
       var primitive = geometry.toDrawPrimitive();
       var material = new EIGHT.MeshMaterial();
       var cube = new EIGHT.Drawable([primitive], material);
   */
  constructor(a: VectorE3 = R3.e1, b: VectorE3 = R3.e2, c: VectorE3 = R3.e3, k: number = Simplex.TRIANGLE, subdivide: number = 0, boundary: number = 0)
  {
    super('CuboidSimplexGeometry')
    this.a = R3.copy(a)
    this.b = R3.copy(b)
    this.c = R3.copy(c)
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
   * @type {R3}
   */
  public get a(): R3 {
    return this._a
  }
  public set a(a: R3) {
    if (a instanceof R3) {
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
   * @type {R3}
   */
  public get b(): R3 {
    return this._b
  }
  public set b(b: R3) {
    if (b instanceof R3) {
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
   * @type {R3}
   */
  public get c(): R3 {
    return this._c
  }
  public set c(c: R3) {
    if (c instanceof R3) {
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
   * @return {CuboidSimplexGeometry} `this` instance.
   */
  public setModified(modified: boolean): CuboidSimplexGeometry {
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

    var pos: R3[] = [0, 1, 2, 3, 4, 5, 6, 7].map(function(index) {return void 0})
    pos[0] = new R3().sub(this._a).sub(this._b).add(this._c).divideByScalar(2)
    pos[1] = new R3().add(this._a).sub(this._b).add(this._c).divideByScalar(2)
    pos[2] = new R3().add(this._a).add(this._b).add(this._c).divideByScalar(2)
    pos[3] = new R3().sub(this._a).add(this._b).add(this._c).divideByScalar(2)
    pos[4] = new R3().copy(pos[3]).sub(this._c)
    pos[5] = new R3().copy(pos[2]).sub(this._c)
    pos[6] = new R3().copy(pos[1]).sub(this._c)
    pos[7] = new R3().copy(pos[0]).sub(this._c)

    function simplex(indices: number[]): Simplex {
      let simplex = new Simplex(indices.length - 1)
      for (var i = 0; i < indices.length; i++) {
        simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]]
        simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_GEOMETRY_INDEX] = new R1([i])
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

export = CuboidSimplexGeometry;
