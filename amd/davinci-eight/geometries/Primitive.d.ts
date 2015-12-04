import Attribute = require('../geometries/Attribute');
import DrawMode = require('../core/DrawMode');
/**
 * @class Primitive
 */
interface Primitive {
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
     * @type {{[name: string]: Attribute}}
     */
    attributes: {
        [name: string]: Attribute;
    };
}
export = Primitive;
