import GeometryData = require('../geometries/GeometryData')
import GeometryElements = require('../geometries/GeometryElements')
import GeometryMeta = require('../geometries/GeometryMeta')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Simplex = require('../geometries/Simplex')
import toGeometryData = require('../geometries/toGeometryData')
import toGeometryMeta = require('../geometries/toGeometryMeta')
import Vector1 = require('../math/Vector1')

/**
 * @class Geometry
 * @extends Shareable
 */
class Geometry extends Shareable {
  /**
   * The geometry as a list of simplices.
   * A simplex, in the context of WebGL, will usually represent a triangle, line or point.
   * @property data
   * @type {Simplex[]}
   */
  public data: Simplex[] = [];
  /**
   * Summary information on the simplices such as dimensionality and sizes for attributes.
   * This data structure may be used to map vertex attribute names to program names.
   * @property meta
   * @type {GeometryMeta}
   */
  public meta: GeometryMeta;
  /**
   * The dimensionality of the simplices in this geometry.
   * @property _k
   * @type {number}
   * @private
   */
  private _k = new Vector1([Simplex.K_FOR_TRIANGLE]);

  // public dynamic = true;
  // public verticesNeedUpdate = false;
  // public elementsNeedUpdate = false;
  // public uvsNeedUpdate = false;
  /**
   * <p>
   * A list of simplices (data) with information about dimensionality and vertex properties (meta). 
   * This class should be used as an abstract base or concrete class when constructing
   * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
   * The <code>Geometry</code> class implements IUnknown, as a convenience to implementations
   * requiring special de-allocation of resources, by extending <code>Shareable</code>.
   * </p>
   * @class Geometry
   * @constructor
   * @param type [string = 'Geometry']
   */
  constructor(type: string = 'Geometry') {
    super(mustBeString('type', type))
    // Force regenerate, even if derived classes don't call setModified.
    this._k.modified = true
  }
  /**
   * The destructor method should be implemented in derived classes and the super.destructor called
   * as the last call in the derived class destructor.
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
  }
  /**
   * <p>
   * The dimensionality of the simplices in this geometry.
   * </p>
   * <p>
   * The <code>k</code> parameter affects geometry generation.
   * </p>
   * <code>k</code> must be an integer.
   * @property k
   * @type {number}
   */
  public get k(): number {
    return this._k.x
  }
  public set k(k: number) {
    this._k.x = mustBeInteger('k', k)
  }
  /**
   * Used to regenerate the simplex data from geometry parameters.
   * This method should be implemented by the derived geometry class.
   * @method regenerate
   * @return {void}
   */
  public regenerate(): void {
    console.warn("`public regenerate(): void` method should be implemented by `" + this._type + "`.")
  }
  /**
   * Used to determine whether the geometry must be recalculated.
   * The base implementation is pessimistic and returns <code>true</code>.
   * This method should be implemented by the derived class to reduce frequent recalculation.
   * @method isModified
   * @return {boolean} if the parameters defining the geometry have been modified.
   */
  public isModified(): boolean {
    return this._k.modified
  }
  /**
   * Sets the modification state of <code>this</code> instance.
   * Derived classes should override this method if they contain parameters which affect geometry calculation. 
   * @method setModified
   * @param modified {boolean} The value that the modification state will be set to.
   * @return {Geometry} `this` instance.
   * @chainable
   */
  public setModified(modified: boolean): Geometry {
    this._k.modified = modified
    return this
  }
  /**
   * <p>
   * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
   * </p>
   * <p>
   * The boundary operation converts simplices of dimension `n` to `n - 1`.
   * For example, triangles are converted to lines.
   * </p>
   *
   * @method boundary
   * @param times {number} Determines the number of times the boundary operation is applied to this instance.
   * @return {Geometry}
   */
  public boundary(times?: number): Geometry {
    if (this.isModified()) {
      this.regenerate()
    }
    this.data = Simplex.boundary(this.data, times);
    return this.check();
  }
  /**
   * Updates the meta property of this instance to match the data.
   *
   * @method check
   * @return {Geometry}
   * @beta
   */
  // FIXME: Rename to something more suggestive.
  public check(): Geometry {
    this.meta = toGeometryMeta(this.data);
    return this;
  }
  /**
   * <p>
   * Applies the subdivide operation to each Simplex in this instance the specified number of times.
   * </p>
   * <p>
   * The subdivide operation creates new simplices of the same dimension as the originals.
   * </p>
   *
   * @method subdivide
   * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
   * @return {Geometry}
   */
  public subdivide(times?: number): Geometry {
    if (this.isModified()) {
      this.regenerate()
    }
    this.data = Simplex.subdivide(this.data, times);
    this.check();
    return this;
  }
  /**
   * @method toGeometry
   * @return {GeometryElements}
   */
  public toElements(): GeometryElements {
    if (this.isModified()) {
      this.regenerate()
    }
    this.check()
    let elements = toGeometryData(this.data, this.meta)
    return new GeometryElements(elements, this.meta)
  }
  /**
   * @method mergeVertices
   * @param precisionPonts [number = 4]
   * @return {void}
   * @protected
   * @beta
   */
  protected mergeVertices(precisionPoints: number = 4): void {
    // console.warn("Geometry.mergeVertices not yet implemented");
  }
}

export = Geometry;
