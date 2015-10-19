import DrawMode = require('../core/DrawMode')
import DrawAttribute = require('../geometries/DrawAttribute')
import mustBeInteger = require('../checks/mustBeInteger')

/**
 * @class DrawPrimitive
 */
class DrawPrimitive {
    /**
     * @property mode
     * @type {DrawMode}
     */
    public mode: DrawMode;
    /**
     * @property indices
     * @type {number[]}
     */
    public indices: number[];
    // TODO: Looks like a DrawAttributeMap here (implementation only)
    /**
     * @property attributes
     * @type {{[name:string]: DrawAttribute}}
     */
    public attributes: { [name: string]: DrawAttribute } = {};
    /**
     * @class DrawPrimitive
     * @constructor
     * @param mode {DrawMode} <p>The geometric primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: DrawAttribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: { [name: string]: DrawAttribute }) {
        mustBeInteger('mode', mode)
        this.mode = mode
        this.indices = indices
        this.attributes = attributes
    }
}

export = DrawPrimitive;
