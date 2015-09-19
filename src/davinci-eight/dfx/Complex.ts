import checkGeometry = require('../dfx/checkGeometry');
import GeometryInfo = require('../dfx/GeometryInfo');
import Simplex = require('../dfx/Simplex');

/**
 * @class Complex
 */
class Complex {
  /**
   * @property data
   * @type {Simplex[]}
   */
  public data: Simplex[] = [];
  /**
   * Summary information on the simplices such as dimensionality and sizes for attributes.
   * This same data structure may be used to map vertex attribute names to program names.
   * @property meta
   * @type {GeometryInfo}
   */
  public meta: GeometryInfo;

  public dynamic = true;
  public verticesNeedUpdate = false;
  public elementsNeedUpdate = false;
  public uvsNeedUpdate = false;
  // TODO: public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
  /**
   * @class Complex
   * @constructor
   */
  constructor() {
  }
  protected mergeVertices(precisionPoints: number = 4) {
    // console.warn("Complex.mergeVertices not yet implemented");
  }
  /**
   * <p>
   * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
   * </p>
   *
   * @method boundary
   * @param times {number} Determines the number of times the boundary operation is applied to this instance.
   * @return {void}
   */
  public boundary(times?: number): void {
    this.data = Simplex.boundary(this.data, times);
    this.check();
  }
  /**
   * Applies the subdivide operation to each Simplex in this instance the specified number of times.
   *
   * @method subdivide
   * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
   * @return {void}
   */
  public subdivide(times?: number) {
    this.data = Simplex.subdivide(this.data, times);
    this.check();
  }
  /**
   * Updates the meta property of this instance to match the data.
   *
   * @method check
   * @return {void}
   */
  public check(): void {
    this.meta = checkGeometry(this.data);
  }
}

export = Complex;
