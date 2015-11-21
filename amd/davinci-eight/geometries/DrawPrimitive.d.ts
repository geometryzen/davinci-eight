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
     * An array of index into the <code>DrawAttribute</code>.
     * @property indices
     * @type {number[]}
     */
    indices: number[];
    /**
     * A map from attribute name to <code>DrawAttribute</code>.
     * @property attributes
     * @type {{[name:string]: DrawAttribute}}
     */
    attributes: {
        [name: string]: DrawAttribute;
    };
    /**
     * A tuple representing the information required to describe a single WebGL primitive.
     * @class DrawPrimitive
     * @constructor
     * @param mode {DrawMode} <p>The primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: DrawAttribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: {
        [name: string]: DrawAttribute;
    });
}
export = DrawPrimitive;
