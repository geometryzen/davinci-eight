import Attribute from '../core/Attribute';
import DrawMode from '../core/DrawMode';
import DrawAttribute from '../geometries/DrawAttribute';
import DrawPrimitive from '../geometries/DrawPrimitive';
import mustBeInteger from '../checks/mustBeInteger';
import Primitive from '../core/Primitive';
import Vertex from '../geometries/Vertex';
import dataFromVectorN from '../geometries/dataFromVectorN';

function attributes(elements: number[], vertices: Vertex[]): { [name: string]: Attribute } {
    const attribs: { [name: string]: Attribute } = {}

    const iLen = vertices.length
    for (let i = 0; i < iLen; i++) {

        const vertex: Vertex = vertices[i]

        const names: string[] = Object.keys(vertex.attributes)
        const jLen = names.length
        for (let j = 0; j < jLen; j++) {
            const name: string = names[j]
            const data: number[] = dataFromVectorN(vertex.attributes[name])
            const size = data.length
            let attrib = attribs[name]
            if (!attrib) {
                attrib = attribs[name] = new DrawAttribute([], size)
            }
            for (let k = 0; k < size; k++) {
                attrib.values.push(data[k])
            }
        }
    }
    return attribs
}

/**
 * A representation of a primitive 
 */
export default class Topology {
    private mode: DrawMode;
    protected elements: number[];
    protected vertices: Vertex[];
    constructor(mode: DrawMode, numVertices: number) {
        this.mode = mustBeInteger('mode', mode)
        mustBeInteger('numVertices', numVertices)
        this.vertices = []
        for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex())
        }
    }
    public toDrawPrimitive(): Primitive {
        return new DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices))
    }
}
