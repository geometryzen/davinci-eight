import DrawMode = require('../core/DrawMode');
import DrawAttribute = require('../geometries/DrawAttribute');
/**
 * @class DrawPrimitive
 */
declare class DrawPrimitive {
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
     * @type {{[name:string]: DrawAttribute}}
     */
    attributes: {
        [name: string]: DrawAttribute;
    };
    /**
     * @class DrawPrimitive
     * @constructor
     * @param mode {DrawMode} <p>The geometric primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: DrawAttribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: {
        [name: string]: DrawAttribute;
    });
}
export = DrawPrimitive;
