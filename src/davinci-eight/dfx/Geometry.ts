import toGeometryMeta = require('../dfx/toGeometryMeta');
import SerialGeometryElements = require('../dfx/SerialGeometryElements');
import SerialGeometry = require('../geometries/SerialGeometry');
import GeometryMeta = require('../dfx/GeometryMeta');
import Simplex = require('../dfx/Simplex');
import toSerialGeometryElements = require('../dfx/toSerialGeometryElements');

/**
 * @class Geometry
 */
class Geometry {
  /**
   * @property data
   * @type {Simplex[]}
   */
  public data: Simplex[] = [];
  /**
   * Summary information on the simplices such as dimensionality and sizes for attributes.
   * This same data structure may be used to map vertex attribute names to program names.
   * @property meta
   * @type {GeometryMeta}
   */
  public meta: GeometryMeta;

  public dynamic = true;
  public verticesNeedUpdate = false;
  public elementsNeedUpdate = false;
  public uvsNeedUpdate = false;
  /**
   * A list of simplices (data) with information about dimensionality and vertex properties (meta). 
   * @class Geometry
   * @constructor
   */
  constructor() {
  }
  /**
   * <p>
   * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
   * </p>
   *
   * @method boundary
   * @param times {number} Determines the number of times the boundary operation is applied to this instance.
   * @return {Geometry}
   */
  public boundary(times?: number): Geometry {
    this.data = Simplex.boundary(this.data, times);
    return this.check();
  }
  /**
   * Updates the meta property of this instance to match the data.
   *
   * @method check
   * @return {Geometry}
   */
  public check(): Geometry {
    this.meta = toGeometryMeta(this.data);
    return this;
  }
  /**
   * Applies the subdivide operation to each Simplex in this instance the specified number of times.
   *
   * @method subdivide
   * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
   * @return {Geometry}
   */
  public subdivide(times?: number): Geometry {
    this.data = Simplex.subdivide(this.data, times);
    this.check();
    return this;
  }
  /**
   * @method toGeometry
   * @return {SerialGeometry}
   */
  public toSerialGeometry(): SerialGeometry {
    let elements = toSerialGeometryElements(this.data, this.meta);
    return new SerialGeometry(elements, this.meta);
  }
  /**
   *
   */
  protected mergeVertices(precisionPoints: number = 4) {
    // console.warn("Geometry.mergeVertices not yet implemented");
  }
}

export = Geometry;
