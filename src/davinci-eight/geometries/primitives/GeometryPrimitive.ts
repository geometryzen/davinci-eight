import Attribute from '../../core/Attribute';
import BeginMode from '../../core/BeginMode';
import DataType from '../../core/DataType';
import DrawAttribute from './DrawAttribute';
import DrawPrimitive from './DrawPrimitive';
import mustBeArray from '../../checks/mustBeArray';
import mustBeGE from '../../checks/mustBeGE';
import mustBeInteger from '../../checks/mustBeInteger';
import notSupported from '../../i18n/notSupported';
import Primitive from '../../core/Primitive';
import Transform from './Transform';
import vertexArraysFromPrimitive from '../../core/vertexArraysFromPrimitive';
import Vertex from './Vertex';
import VertexArrays from '../../core/VertexArrays';
import dataFromVectorN from '../dataFromVectorN';

/**
 * This helper function converts Vertex (VectorN) attributes into the Primitive (number[]) format.
 * There is some mahic in the conversion of various types (Geometric2, Geometric3, Vector2, Vector3)
 * to number[], but the basic rule is that the vector grade is extracted and used in a way that is
 * consistent with the linear dimension (2,3), so there should be no surprises.
 */
function attributes(unused: number[], vertices: Vertex[]): { [name: string]: Attribute } {
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
                attrib = attribs[name] = new DrawAttribute([], size, DataType.FLOAT)
            }
            for (let k = 0; k < size; k++) {
                attrib.values.push(data[k])
            }
        }
    }
    return attribs
}

/**
 * The GeometryPrimitive class provides the preferred method for creating geometries.
 * Classes derived from GeometryPrimitive create vertices and pathways through them
 * with indices such as TRIANGLE_STRIP. (Reversing this procedure from an arbitrary
 * collection of simplices is an NP problem). The resulting topology can then be
 * modified by a parameterized function either prior to buffering or in a shader.
 * GeometryPrimitive uses the Vertex structure which is based on VectorN for ease of mesh
 * generation and transformation. Topolgy provides a toPrimitive method which results
 * in a more compact representation based upon number[]. An even more compact
 * representation is VertexArrays, which interleaves the vertex
 *
 * @class GeometryPrimitive
 */
export default class GeometryPrimitive {
    /**
     *
     */
    private mode: BeginMode;

    /**
     * @property elements
     * @type number[]
     * @protected
     */
    protected elements: number[];

    /**
     * @property vertices
     * @type Vertex
     * @protected
     */
    protected vertices: Vertex[];

    /**
     * Constructs a GeometryPrimitive and initializes the vertices property with the required number of vertices.
     *
     * @class GeometryPrimitive
     * @constructor
     * @param mode
     * @param numVertices
     * @param numCoordinates The number of coordinates required to label each vertex.
     */
    constructor(mode: BeginMode, numVertices: number, numCoordinates: number) {
        this.mode = mustBeInteger('mode', mode)
        mustBeInteger('numVertices', numVertices)
        mustBeGE('numVertices', numVertices, 0)
        mustBeInteger('numCoordinates', numCoordinates)
        mustBeGE('numCoordinates', numCoordinates, 0)
        this.vertices = []
        for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex(numCoordinates))
        }
    }

    public vertexTransform(transform: Transform): void {
        // Derived classes must implement in order to supply correct ranges.
        throw new Error(notSupported('vertexTransform').message)
    }

    /**
     * @method toPrimitive
     * @return {Primitive}
     */
    public toPrimitive(): Primitive {
        // Derived classes are responsible for allocating the elements array.
        const context = () => { return 'toPrimitive' }
        mustBeArray('elements', this.elements, context)
        return new DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices))
    }

    /**
     * @method toVertexArrays
     * @param [names] {string[]} Optional. Allows the attributes to be filtered and ordered.
     * @return {VertexArrays}
     */
    public toVertexArrays(names?: string[]): VertexArrays {
        return vertexArraysFromPrimitive(this.toPrimitive(), names)
    }
}
