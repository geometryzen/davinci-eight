import SerialGeometryElements = require('../dfx/SerialGeometryElements');
import GeometryMeta = require('../dfx/GeometryMeta');

/**
 * <p>
 * A geometry holds the elements or arrays sent to the GLSL pipeline.
 * </p>
 * <p>
 * These instructions are in a compact form suitable for populating WebGLBuffer(s).
 * </p>
 *
 * @class SerialGeometry
 */
class SerialGeometry {
  /**
   * @property data
   * @type {SerialGeometry}
   */
  public data: SerialGeometryElements;
  /**
   * @property meta
   * @type {GeometryMeta}
   */
  // FIXME: GeometryMeta vanishes in the API docs because it is an interface.
  public meta: GeometryMeta;
  /**
   * @class SerialGeometry
   * @constructor
   * @param data {SerialGeometryElements} The instructions for drawing the geometry.
   * @param meta {GeometryMeta} 
   */
  constructor(data: SerialGeometryElements, meta: GeometryMeta) {
    this.data = data;
    this.meta = meta;
  }
}

export = SerialGeometry;
