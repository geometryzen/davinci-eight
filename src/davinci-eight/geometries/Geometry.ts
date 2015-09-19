import DrawElements = require('../dfx/DrawElements');
import GeometryInfo = require('../dfx/GeometryInfo');

/**
 * <p>
 * A geometry holds the elements or arrays sent to the GLSL pipeline.
 * </p>
 * <p>
 * These instructions are in a compact form suitable for populating WebGLBuffer(s).
 * </p>
 *
 * @class Geometry
 */
class Geometry {
  /**
   * @property data
   * @type {DrawElements}
   */
  public data: DrawElements;
  /**
   * @property meta
   * @type {GeometryInfo}
   */
  // FIXME: GeometryInfo vanishes in the API docs because it is an interface.
  public meta: GeometryInfo;
  /**
   * @class Geometry
   * @constructor
   * @param data {DrawElements} The instructions for drawing the geometry.
   * @param meta {GeometryInfo} 
   */
  constructor(data: DrawElements, meta: GeometryInfo) {
    this.data = data;
    this.meta = meta;
  }
}

export = Geometry;
