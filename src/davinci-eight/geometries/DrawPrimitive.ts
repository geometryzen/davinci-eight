import Attribute from '../geometries/Attribute';
import DrawMode from '../core/DrawMode';
import mustBeArray from '../checks/mustBeArray';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeObject from '../checks/mustBeObject';
import Primitive from '../geometries/Primitive';

/**
 * @class DrawPrimitive
 */
export default class DrawPrimitive implements Primitive {

    /**
     * @property mode
     * @type {DrawMode}
     */
    public mode: DrawMode;

    /**
     * An array of index into the <code>Attribute</code>.
     * @property indices
     * @type {number[]}
     */
    public indices: number[];

    // TODO: Looks like a DrawAttributeMap here (implementation only)
    /**
     * A map from attribute name to <code>Attribute</code>.
     * @property attributes
     * @type {{[name:string]: Attribute}}
     */
    public attributes: { [name: string]: Attribute } = {};

    /**
     * A tuple representing the information required to describe a single WebGL primitive.
     * @class DrawPrimitive
     * @constructor
     * @param mode {DrawMode} <p>The primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: Attribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: { [name: string]: Attribute }) {
        this.mode = mustBeInteger('mode', mode)
        this.indices = mustBeArray('indices', indices)
        this.attributes = mustBeObject('attributes', attributes)
    }
}
