import GeometryData = require('../dfx/GeometryData');
import GeometryMeta = require('../dfx/GeometryMeta');

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
   * @type {GeometryData}
   */
  public data: GeometryData;
  /**
   * @property meta
   * @type {GeometryMeta}
   */
  // FIXME: GeometryMeta vanishes in the API docs because it is an interface.
  public meta: GeometryMeta;
  /**
   * @class Geometry
   * @constructor
   * @param data {GeometryData} The instructions for drawing the geometry.
   * @param meta {GeometryMeta} 
   */
  constructor(data: GeometryData, meta: GeometryMeta) {
    this.data = data;
    this.meta = meta;
  }
}

export = Geometry;
