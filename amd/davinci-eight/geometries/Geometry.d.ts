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
declare class Geometry {
    /**
     * @property data
     * @type {GeometryData}
     */
    data: GeometryData;
    /**
     * @property meta
     * @type {GeometryMeta}
     */
    meta: GeometryMeta;
    /**
     * @class Geometry
     * @constructor
     * @param data {GeometryData} The instructions for drawing the geometry.
     * @param meta {GeometryMeta}
     */
    constructor(data: GeometryData, meta: GeometryMeta);
}
export = Geometry;
