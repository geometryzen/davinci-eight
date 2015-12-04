import Attribute = require('../geometries/Attribute');
import DrawMode = require('../core/DrawMode');
import Primitive = require('../geometries/Primitive');
/**
 * @class DrawPrimitive
 */
declare class DrawPrimitive implements Primitive {
    /**
     * @property mode
     * @type {DrawMode}
     */
    mode: DrawMode;
    /**
     * An array of index into the <code>Attribute</code>.
     * @property indices
     * @type {number[]}
     */
    indices: number[];
    /**
     * A map from attribute name to <code>Attribute</code>.
     * @property attributes
     * @type {{[name:string]: Attribute}}
     */
    attributes: {
        [name: string]: Attribute;
    };
    /**
     * A tuple representing the information required to describe a single WebGL primitive.
     * @class DrawPrimitive
     * @constructor
     * @param mode {DrawMode} <p>The primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: Attribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: {
        [name: string]: Attribute;
    });
}
export = DrawPrimitive;
