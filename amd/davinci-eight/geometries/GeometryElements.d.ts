import DrawMode = require('../core/DrawMode');
import GeometryAttribute = require('../geometries/GeometryAttribute');
/**
 * @class GeometryElements
 */
declare class GeometryElements {
    /**
     * @property mode
     * @type {DrawMode}
     */
    mode: DrawMode;
    /**
     * @property indices
     * @type {number[]}
     */
    indices: number[];
    /**
     * @property attributes
     * @type {{[name:string]: GeometryAttribute}}
     */
    attributes: {
        [name: string]: GeometryAttribute;
    };
    /**
     * @class GeometryElements
     * @constructor
     * @param mode {DrawMode} <p>The geometric primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: GeometryAttribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: {
        [name: string]: GeometryAttribute;
    });
}
export = GeometryElements;
