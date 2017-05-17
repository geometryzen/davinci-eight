import { Geometric3 } from '../math/Geometric3';
import { Vector3 } from '../math/Vector3';
import { Vertex } from '../atoms/Vertex';
import { Transform } from '../atoms/Transform';
export declare class ShapeBuilder {
    /**
     * The scaling to apply to the geometry in the initial configuration.
     * This has a slightly strange sounding name because it involves a
     * reference frame specific transformation.
     *
     * This may be replaced by a Matrix3 in future.
     */
    stress: Vector3;
    /**
     * The rotor to apply to the geometry (after scale has been applied).
     */
    tilt: Geometric3;
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
    /**
     *
     */
    constructor();
    applyTransforms(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void;
}
