import SerialGeometryAttribute = require('../dfx/SerialGeometryAttribute');
import VectorN = require('../math/VectorN');
/**
 * @class SerialGeometryElements
 */
declare class SerialGeometryElements {
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
     * @type {{[name:string]: SerialGeometryAttribute}}
     */
    attributes: {
        [name: string]: SerialGeometryAttribute;
    };
    /**
     * @class SerialGeometryElements
     * @constructor
     * @param k {number} <p>The dimensionality of the primitives.</p>
     * @param indices {VectorN} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: SerialGeometryAttribute}}
     */
    constructor(k: number, indices: VectorN<number>, attributes: {
        [name: string]: SerialGeometryAttribute;
    });
}
export = SerialGeometryElements;
