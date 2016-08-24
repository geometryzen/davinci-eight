import GeometryBuilder from './GeometryBuilder';
import Primitive from '../core/Primitive';
import Vector3 from '../math/Vector3';
import Vertex from '../atoms/Vertex';
import VertexArrays from '../core/VertexArrays';
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';
import Transform from '../atoms/Transform';

/**
 * A GeometryBuilder that takes building Primitive arrays as primary.
 */
export default class PrimitivesBuilder implements GeometryBuilder {

    /**
     * The scaling to apply to the geometry in the initial configuration.
     * This has a slightly strange sounding name because it involves a
     * reference frame specific transformation.
     *
     * This may be replaced by a Matrix3 in future.
     *
     * @property stress
     * @type Vector3
     * @default vector(1, 1, 1)
     * @beta
     */
    public stress = Vector3.vector(1, 1, 1);

    /**
     * The translation to apply to the geometry (after tilt has been applied).
     * @property offset
     * @type Vector3
     * @default 0
     */
    public offset = Vector3.zero();

    /**
     * @property transforms
     * @type Transform[]
     */
    public transforms: Transform[] = [];

    /**
     * Determines whether to include normals in the geometry.
     *
     * @property useNormal
     * @type boolean
     * @default true
     */
    public useNormal = true;

    /**
     * Determines whether to include positions in the geometry.
     *
     * @property usePosition
     * @type boolean
     * @default true
     */
    public usePosition = true;

    /**
     * Determines whether to include texture coordinates in the geometry.
     *
     * @property useTextureCoord
     * @type boolean
     * @default false
     */
    public useTextureCoord = false;

    /**
     * @class PrimitivesBuilder
     * @constructor
     */
    constructor() {
        // Do nothing.
    }

    public applyTransforms(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const tLen = this.transforms.length;
        for (let t = 0; t < tLen; t++) {
            this.transforms[t].exec(vertex, i, j, iLength, jLength);
        }
    }

    /**
     * @method toVertexArrays
     * @return {VertexArray[]}
     * @beta
     */
    toVertexArrays(): VertexArrays[] {
        const arrays: VertexArrays[] = [];
        const ps = this.toPrimitives();
        const iLen = ps.length;
        for (let i = 0; i < iLen; i++) {
            arrays.push(vertexArraysFromPrimitive(ps[i]));
        }
        return arrays;
    }

    /**
     * @method toPrimitives
     * @type Primitive[]
     */
    toPrimitives(): Primitive[] {
        console.warn("toPrimitives() must be implemented by derived classes.");
        return [];
    }
}
