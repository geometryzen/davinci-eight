import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { Primitive } from '../core/Primitive';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
/**
 * A framework, as a base class, for building primitives by applying transformations to vertices.
 */
export declare class PrimitivesBuilder {
    /**
     *
     */
    zenith: Vector3;
    /**
     *
     */
    meridian: Vector3;
    /**
     * The scaling to apply to the geometry in the initial configuration.
     * This has a slightly strange sounding name because it involves a
     * reference frame specific transformation.
     *
     * This may be replaced by a Matrix3 in future.
     */
    stress: Vector3;
    /**
     * The rotation to apply to the geometry (after the stress has been applied).
     */
    tilt: Spinor3;
    /**
     * The translation to apply to the geometry (after tilt has been applied).
     */
    offset: Vector3;
    /**
     *
     */
    transforms: Transform[];
    /**
     * Determines whether to include normals in the geometry.
     */
    useNormal: boolean;
    /**
     * Determines whether to include positions in the geometry.
     */
    usePosition: boolean;
    /**
     * Determines whether to include texture coordinates in the geometry.
     */
    useTextureCoord: boolean;
    constructor();
    /**
     * Applies the transforms defined in this class to the vertex specified.
     */
    applyTransforms(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
    /**
     * Derived classes must implement.
     */
    toPrimitives(): Primitive[];
}
