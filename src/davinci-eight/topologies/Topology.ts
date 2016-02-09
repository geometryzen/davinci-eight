import Attribute from '../core/Attribute';
import DrawMode from '../core/DrawMode';
import DrawAttribute from '../geometries/DrawAttribute';
import DrawPrimitive from '../geometries/DrawPrimitive';
import G3 from '../math/G3';
import mustBeInteger from '../checks/mustBeInteger';
import Primitive from '../core/Primitive';
import Simplex from '../geometries/Simplex';
import VectorN from '../math/VectorN';
import Vertex from '../geometries/Vertex';
import dataFromVectorN from '../geometries/dataFromVectorN';

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
