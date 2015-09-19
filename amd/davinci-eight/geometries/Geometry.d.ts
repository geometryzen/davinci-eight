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
declare class Geometry {
    /**
     * @property data
     * @type {DrawElements}
     */
    data: DrawElements;
    /**
     * @property meta
     * @type {GeometryInfo}
     */
    meta: GeometryInfo;
    /**
     * @class Geometry
     * @constructor
     * @param data {DrawElements} The instructions for drawing the geometry.
     * @param meta {GeometryInfo}
     */
    constructor(data: DrawElements, meta: GeometryInfo);
}
export = Geometry;
