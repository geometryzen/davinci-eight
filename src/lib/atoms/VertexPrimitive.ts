import { mustBeArray } from '../checks/mustBeArray';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { Attribute } from '../core/Attribute';
import { AttributeSizeType } from '../core/AttributeSizeType';
import { BeginMode } from '../core/BeginMode';
import { DataType } from '../core/DataType';
import { Primitive } from '../core/Primitive';
import { dataFromVectorN } from '../geometries/dataFromVectorN';
import { notSupported } from '../i18n/notSupported';
import { DrawAttribute } from './DrawAttribute';
import { DrawPrimitive } from './DrawPrimitive';
import { Transform } from './Transform';
import { Vertex } from './Vertex';

/**
 * @hidden
 */
function checkSize(length: number): AttributeSizeType {
    if (length === 1) {
        return 1;
    }
    else if (length === 2) {
        return 2;
    }
    else if (length === 3) {
        return 3;
    }
    else if (length === 4) {
        return 4;
    }
    else {
        throw new Error("length must be 1, 2, 3, or 4");
    }
}

/**
 * This helper function converts Vertex (VectorN) attributes into the Primitive (number[]) format.
 * There is some magic in the conversion of various types (Geometric2, Geometric3, Vector2, Vector3)
 * to number[], but the basic rule is that the vector grade is extracted and used in a way that is
 * consistent with the linear dimension (2,3), so there should be no surprises.
 * @hidden
 */
function attributes(elements: number[], vertices: Vertex[]): { [name: string]: Attribute } {
    mustBeArray('elements', elements);
    const attribs: { [name: string]: Attribute } = {};

    const iLen = vertices.length;
    for (let i = 0; i < iLen; i++) {

        const vertex: Vertex = vertices[i];

        const names: string[] = Object.keys(vertex.attributes);
        const jLen = names.length;
        for (let j = 0; j < jLen; j++) {
            const name: string = names[j];
            const data: number[] = dataFromVectorN(vertex.attributes[name]);
            const size = checkSize(data.length);
            let attrib = attribs[name];
            if (!attrib) {
                attrib = attribs[name] = new DrawAttribute([], size, DataType.FLOAT);
            }
            for (let k = 0; k < size; k++) {
                attrib.values.push(data[k]);
            }
        }
    }
    return attribs;
}

/**
 * The VertexPrimitive class provides the preferred method for creating geometries.
 * Classes derived from VertexPrimitive create vertices and pathways through them
 * with indices such as TRIANGLE_STRIP. (Reversing this procedure from an arbitrary
 * collection of simplices is an NP problem). The resulting topology can then be
 * modified by a parameterized function either prior to buffering or in a shader.
 * VertexPrimitive uses the Vertex structure which is based on VectorN for ease of mesh
 * generation and transformation. Topolgy provides a toPrimitive method which results
 * in a more compact representation based upon number[]. An even more compact
 * representation is VertexArrays, which interleaves the vertex.
 */
export class VertexPrimitive {
    /**
     *
     */
    private mode: BeginMode;
    /**
     *
     */
    protected elements: number[];
    /**
     *
     */
    protected vertices: Vertex[];
    /**
     * Constructs a VertexPrimitive and initializes the vertices property with the required number of vertices.
     *
     * @param mode
     * @param numVertices
     * @param numCoordinates The number of coordinates required to label each vertex.
     */
    constructor(mode: BeginMode, numVertices: number, numCoordinates: number) {
        this.mode = mustBeInteger('mode', mode);
        mustBeInteger('numVertices', numVertices);
        mustBeGE('numVertices', numVertices, 0);
        mustBeInteger('numCoordinates', numCoordinates);
        mustBeGE('numCoordinates', numCoordinates, 0);
        this.vertices = [];
        for (let i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex(numCoordinates));
        }
    }

    public vertexTransform(transform: Transform): void {
        mustBeNonNullObject('transform', transform);
        // Derived classes must implement in order to supply correct ranges.
        throw new Error(notSupported('vertexTransform').message);
    }

    /**
     *
     */
    public toPrimitive(): Primitive {
        // Derived classes are responsible for allocating the elements array.
        const context = () => { return 'toPrimitive'; };
        mustBeArray('elements', this.elements, context);
        return new DrawPrimitive(this.mode, this.elements, attributes(this.elements, this.vertices));
    }
}
