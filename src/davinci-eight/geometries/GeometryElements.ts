import DrawMode = require('../core/DrawMode')
import GeometryAttribute = require('../geometries/GeometryAttribute')
import mustBeInteger = require('../checks/mustBeInteger')
import VectorN = require('../math/VectorN')

/**
 * @class GeometryElements
 */
class GeometryElements {
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
     * @type {{[name:string]: GeometryAttribute}}
     */
    public attributes: { [name: string]: GeometryAttribute } = {};
    /**
     * @class GeometryElements
     * @constructor
     * @param mode {DrawMode} <p>The geometric primitive type.</p>
     * @param indices {number[]} <p>A list of index into the attributes</p>
     * @param attributes {{[name:string]: GeometryAttribute}}
     */
    constructor(mode: DrawMode, indices: number[], attributes: { [name: string]: GeometryAttribute }) {
        mustBeInteger('mode', mode)
        this.mode = mode
        this.indices = indices
        this.attributes = attributes
    }
}

export = GeometryElements;
