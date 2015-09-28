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
declare class SerialGeometry {
    /**
     * @property data
     * @type {SerialGeometry}
     */
    data: SerialGeometryElements;
    /**
     * @property meta
     * @type {GeometryMeta}
     */
    meta: GeometryMeta;
    /**
     * @class SerialGeometry
     * @constructor
     * @param data {SerialGeometryElements} The instructions for drawing the geometry.
     * @param meta {GeometryMeta}
     */
    constructor(data: SerialGeometryElements, meta: GeometryMeta);
}
export = SerialGeometry;
