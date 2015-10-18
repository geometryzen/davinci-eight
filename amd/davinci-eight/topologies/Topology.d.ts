import DrawMode = require('../core/DrawMode');
import GeometryElements = require('../geometries/GeometryElements');
import Vertex = require('../geometries/Vertex');
/**
 * @class Topology
 */
declare class Topology {
    /**
     * @property mode
     * @type {DrawMode}
     * @private
     */
    private mode;
    /**
     * @property elements
     * @type {number[]}
     * @protected
     */
    protected elements: number[];
    /**
     * @property vertices
     * @type {Vertex[]}
     * @protected
     */
    protected vertices: Vertex[];
    /**
     * Abstract base class for all geometric primitive types
     * @class Topology
     * @constructor
     * @param mode {DrawMode}
     * @param numVertices {number}
     */
    constructor(mode: DrawMode, numVertices: number);
    /**
     * Creates the elements in a format required for WebGL.
     * This may involve creating some redundancy in order to get WebGL efficiency.
     * Thus, we should regard the topology as normalized
     * @method toElements
     * @return {GeometryElements}
     */
    toElements(): GeometryElements;
}
export = Topology;
