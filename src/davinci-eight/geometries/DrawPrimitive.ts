import DrawMode = require('../core/DrawMode')
import DrawAttribute = require('../geometries/DrawAttribute')
import mustBeArray = require('../checks/mustBeArray')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeObject = require('../checks/mustBeObject')

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
     * An array of index into the <code>DrawAttribute</code>.
     * @property indices
     * @type {number[]}
     */
    public indices: number[];

    // TODO: Looks like a DrawAttributeMap here (implementation only)
    /**
     * A map from attribute name to <code>DrawAttribute</code>.
     * @property attributes
     * @type {{[name:string]: DrawAttribute}}
     */
    public attributes: { [name: string]: DrawAttribute } = {};

    /**
     * A tuple representing the information required to describe a single WebGL primitive.
     * @class DrawPrimitive
     * @constructor
     * @param mode {DrawMode} <p>The primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: DrawAttribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: { [name: string]: DrawAttribute }) {
        this.mode = mustBeInteger('mode', mode)
        this.indices = mustBeArray('indices', indices)
        this.attributes = mustBeObject('attributes', attributes)
    }
}

export = DrawPrimitive;
