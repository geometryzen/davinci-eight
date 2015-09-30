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
declare class GeometryElements {
    /**
     * @property data
     * @type {GeometryElements}
     */
    data: GeometryData;
    /**
     * @property meta
     * @type {GeometryMeta}
     */
    meta: GeometryMeta;
    /**
     * @class GeometryElements
     * @constructor
     * @param data {GeometryData} The instructions for drawing the geometry.
     * @param meta {GeometryMeta}
     */
    constructor(data: GeometryData, meta: GeometryMeta);
}
export = GeometryElements;
