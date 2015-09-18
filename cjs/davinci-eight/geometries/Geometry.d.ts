import DrawElements = require('../dfx/DrawElements');
import GeometryInfo = require('../dfx/GeometryInfo');
/**
 * @class Geometry
 */
declare class Geometry {
    elements: DrawElements;
    metadata: GeometryInfo;
    constructor(elements: DrawElements, metadata: GeometryInfo);
}
export = Geometry;
