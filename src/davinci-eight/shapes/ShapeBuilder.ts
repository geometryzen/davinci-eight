import { Geometric3 } from '../math/Geometric3';
import Vector3 from '../math/Vector3';
import Vertex from '../atoms/Vertex';
import Transform from '../atoms/Transform';

export default class ShapeBuilder {

    /**
     * The scaling to apply to the geometry in the initial configuration.
     * This has a slightly strange sounding name because it involves a
     * reference frame specific transformation.
     *
     * This may be replaced by a Matrix3 in future.
     */
    public stress = Vector3.vector(1, 1, 1);

    /**
     * The rotor to apply to the geometry (after scale has been applied).
     */
    public tilt: Geometric3 = Geometric3.one();

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

    /**
     *
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
}
