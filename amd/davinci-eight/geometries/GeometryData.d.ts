import GeometryAttribute = require('../geometries/GeometryAttribute');
import VectorN = require('../math/VectorN');
/**
 * @class GeometryData
 */
declare class GeometryData {
    /**
     * 0 => POINTS, 1 => LINES, 2 => TRIANGLES
     */
    k: number;
    /**
     * @property indices
     * @type {VectorN}
     */
    indices: VectorN<number>;
    /**
     * @property attributes
     * @type {{[name:string]: GeometryAttribute}}
     */
    attributes: {
        [name: string]: GeometryAttribute;
    };
    /**
     * @class GeometryData
     * @constructor
     * @param k {number} <p>The dimensionality of the primitives.</p>
     * @param indices {VectorN} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: GeometryAttribute}}
     */
    constructor(k: number, indices: VectorN<number>, attributes: {
        [name: string]: GeometryAttribute;
    });
}
export = GeometryData;
