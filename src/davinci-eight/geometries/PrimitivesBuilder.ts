import Primitive from '../core/Primitive';
import Spinor3 from '../math/Spinor3';
import Vector3 from '../math/Vector3';
import Vertex from '../atoms/Vertex';
import Transform from '../atoms/Transform';

/**
 * A framework, as a base class, for building primitives by applying transformations to vertices.
 */
export default class PrimitivesBuilder {

    /**
     * The scaling to apply to the geometry in the initial configuration.
     * This has a slightly strange sounding name because it involves a
     * reference frame specific transformation.
     *
     * This may be replaced by a Matrix3 in future.
     */
    public stress = Vector3.vector(1, 1, 1);

    /**
     * The rotation to apply to the geometry (after the stress has been applied).
     */
    public tilt = Spinor3.one();

    /**
     * The translation to apply to the geometry (after tilt has been applied).
     */
    public offset = Vector3.zero();

    /**
     * 
     */
    public transforms: Transform[] = [];

    /**
     * Determines whether to include normals in the geometry.
     */
    public useNormal = true;

    /**
     * Determines whether to include positions in the geometry.
     */
    public usePosition = true;

    /**
     * Determines whether to include texture coordinates in the geometry.
     */
    public useTextureCoord = false;

    constructor() {
        // Do nothing.
    }

    /**
     * Applies the transforms defined in this class to the vertex specified.
     */
    public applyTransforms(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const tLen = this.transforms.length;
        for (let t = 0; t < tLen; t++) {
            this.transforms[t].exec(vertex, i, j, iLength, jLength);
        }
    }

    /**
     * Derived classes must implement.
     */
    toPrimitives(): Primitive[] {
        console.warn("toPrimitives() must be implemented by derived classes.");
        return [];
    }
}
