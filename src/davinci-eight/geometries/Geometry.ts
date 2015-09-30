import toGeometryMeta = require('../geometries/toGeometryMeta');
import GeometryData = require('../geometries/GeometryData');
import GeometryElements = require('../geometries/GeometryElements');
import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
import toGeometryData = require('../geometries/toGeometryData');

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
   * This class should be used as an abstract base or concrete class when constructing
   * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
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
  // FIXME: Rename to something more descriptive.
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
   * @return {GeometryElements}
   */
  public toElements(): GeometryElements {
    this.check()
    let elements = toGeometryData(this.data, this.meta)
    return new GeometryElements(elements, this.meta)
  }
  /**
   *
   */
  protected mergeVertices(precisionPoints: number = 4) {
    // console.warn("Geometry.mergeVertices not yet implemented");
  }
}

export = Geometry;
