import GeometryData = require('../geometries/GeometryData');
import GeometryMeta = require('../geometries/GeometryMeta');

/**
 * <p>
 * A geometry holds the elements or arrays sent to the GLSL pipeline.
 * </p>
 * <p>
 * These instructions are in a compact form suitable for populating WebGLBuffer(s).
 * </p>
 *
 * @class GeometryElements
 */
class GeometryElements {
  /**
   * @property data
   * @type {GeometryElements}
   */
  public data: GeometryData;
  /**
   * @property meta
   * @type {GeometryMeta}
   */
  // FIXME: GeometryMeta vanishes in the API docs because it is an interface.
  public meta: GeometryMeta;
  /**
   * @class GeometryElements
   * @constructor
   * @param data {GeometryData} The instructions for drawing the geometry.
   * @param meta {GeometryMeta} 
   */
  constructor(data: GeometryData, meta: GeometryMeta) {
    this.data = data;
    this.meta = meta;
  }
}

export = GeometryElements;
