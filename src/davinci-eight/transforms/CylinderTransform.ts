import mustBeNumber from '../checks/mustBeNumber';
import mustBeString from '../checks/mustBeString';
import Spinor3 from '../math/Spinor3';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';
import Vertex from '../atoms/Vertex';
import Transform from '../atoms/Transform';

/**
 *
 */
export default class CylinderTransform implements Transform {
    /**
     * Vector pointing along the symmetry axis of the cone and also representing the height of the cylinder.
     */
    private height: Vector3;

    /**
     * Starting direction and the radius vector that is swept out.
     */
    private cutLine: Vector3;

    private generator: Spinor3;
    private sliceAngle: number;
    private aPosition: string;
    private aTangent: string;
    /**
     * +1 is conventional orientation with outward normals.
     * -1 for inward facing normals.
     */
    private orientation: number;

    /**
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    constructor(
        height: VectorE3, cutLine: VectorE3, clockwise: boolean, sliceAngle: number, orientation: number, aPosition: string, aTangent: string) {
        this.height = Vector3.copy(height);
        this.cutLine = Vector3.copy(cutLine);
        this.generator = Spinor3.dual(this.height.clone().normalize(), clockwise);
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle);
        this.orientation = mustBeNumber('orientation', orientation);
        this.aPosition = mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString('aTangent', aTangent);
    }

    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const uSegments = iLength - 1;
        const u = i / uSegments;

        const vSegments = jLength - 1;
        const v = j / vSegments;

        const rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();

        /**
         * Point on the wall of the cylinder, initially with no vertical component.
         */
        const ρ = Vector3.copy(this.cutLine).rotate(rotor);

        vertex.attributes[this.aPosition] = ρ.clone().add(this.height, v);
        vertex.attributes[this.aTangent] = Spinor3.dual(ρ, false).scale(this.orientation);
    }
}
