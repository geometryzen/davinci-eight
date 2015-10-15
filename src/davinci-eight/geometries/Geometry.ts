import GeometryData = require('../geometries/GeometryData')
import GeometryElements = require('../geometries/GeometryElements')
import GeometryMeta = require('../geometries/GeometryMeta')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Simplex = require('../geometries/Simplex')
import toGeometryData = require('../geometries/toGeometryData')
import toGeometryMeta = require('../geometries/toGeometryMeta')

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
   * Used to recalculate the simplex data from geometry parameters.
   * This method should be implemented by the derived geometry class.
   * @method recalculate
   * @return {void}
   */
  public recalculate(): void {
    console.warn("`public recalculate(): void` method should be implemented by `" + this._type + "`.")
  }
  /**
   * Used to determine whether the geometry must be recalculated.
   * The base implementation is pessimistic and returns <code>true</code>.
   * This method should be implemented by the derived class to reduce frequent recalculation.
   * @method isModified
   * @return {boolean} if the parameters defining the geometry have been modified.
   */
  public isModified(): boolean {
    // Assume that the Geometry parameters have been modified as the default.
    // Derived classes can be more efficient.
    return true
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
      this.recalculate()
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
      this.recalculate()
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
      this.recalculate()
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
