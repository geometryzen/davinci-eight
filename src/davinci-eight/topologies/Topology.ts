import Attribute = require('../geometries/Attribute')
import DrawMode = require('../core/DrawMode')
import DrawAttribute = require('../geometries/DrawAttribute')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import G3 = require('../math/G3')
import mustBeInteger = require('../checks/mustBeInteger')
import Primitive = require('../geometries/Primitive')
import Simplex = require('../geometries/Simplex')
import VectorN = require('../math/VectorN')
import Vertex = require('../geometries/Vertex')
import dataFromVectorN = require('../geometries/dataFromVectorN')

function attributes(elements: number[], vertices: Vertex[]): { [name: string]: Attribute } {
    let attribs: { [name: string]: Attribute } = {}

    for (var vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {

        var vertex: Vertex = vertices[vertexIndex]

        var names: string[] = Object.keys(vertex.attributes)
        for (var namesIndex = 0; namesIndex < names.length; namesIndex++) {
            var name: string = names[namesIndex]
            var data: number[] = dataFromVectorN(vertex.attributes[name])
            var size = data.length
            var attrib = attribs[name]
            if (!attrib) {
                attrib = attribs[name] = new DrawAttribute([], size)
            }
            for (var coordIndex = 0; coordIndex < size; coordIndex++) {
                attrib.values.push(data[coordIndex])
            }
        }
    }
    return attribs
}

/**
 * @class Topology
 */
class Topology {
    /**
     * @property mode
     * @type {DrawMode}
     * @private
     */
    private mode: DrawMode;
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
    constructor(mode: DrawMode, numVertices: number) {
        this.mode = mustBeInteger('mode', mode)
        mustBeInteger('numVertices', numVertices)
        this.vertices = []
        for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex())
        }
    }
    /**
     * Creates the elements in a format required for WebGL.
     * This may involve creating some redundancy in order to get WebGL efficiency.
     * Thus, we should regard the topology as normalized
     * @method toDrawPrimitive
     * @return {Primitive}
     */
    public toDrawPrimitive(): Primitive {
        return new DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices))
    }
}

export = Topology