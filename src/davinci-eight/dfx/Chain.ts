import toGeometryMeta = require('../dfx/toGeometryMeta');
import GeometryData = require('../dfx/GeometryData');
import Geometry = require('../geometries/Geometry');
import GeometryMeta = require('../dfx/GeometryMeta');
import Simplex = require('../dfx/Simplex');
import toGeometryData = require('../dfx/toGeometryData');

/**
 * @class Chain
 */
class Chain {
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
   * @class Chain
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
   * @return {Chain}
   */
  public boundary(times?: number): Chain {
    this.data = Simplex.boundary(this.data, times);
    return this.check();
  }
  /**
   * Updates the meta property of this instance to match the data.
   *
   * @method check
   * @return {Chain}
   */
  public check(): Chain {
    this.meta = toGeometryMeta(this.data);
    return this;
  }
  /**
   * Applies the subdivide operation to each Simplex in this instance the specified number of times.
   *
   * @method subdivide
   * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
   * @return {Chain}
   */
  public subdivide(times?: number): Chain {
    this.data = Simplex.subdivide(this.data, times);
    this.check();
    return this;
  }
  /**
   * @method toGeometry
   * @return {Geometry}
   */
  public toGeometry(): Geometry {
    let elements = toGeometryData(this.data, this.meta);
    return new Geometry(elements, this.meta);
  }
  /**
   *
   */
  protected mergeVertices(precisionPoints: number = 4) {
    // console.warn("Chain.mergeVertices not yet implemented");
  }
}

export = Chain;
