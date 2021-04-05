import { reduce } from '../atoms/reduce';
import { mustBeDefined } from '../checks/mustBeDefined';
import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { RingBuilder } from '../shapes/RingBuilder';
import { AxialShapeBuilder } from './AxialShapeBuilder';
import { ConeBuilder } from './ConeBuilder';

/**
 * @hidden
 */
export class ArrowHeadBuilder extends AxialShapeBuilder {

    public heightCone = 0.20;

    public radiusCone = 0.08;

    public radiusShaft = 0.01;

    public thetaSegments = 16;

    private e: VectorE3;
    private cutLine: VectorE3;
    private clockwise: boolean;

    /**
     *
     * @param axis The direction of the arrow. The argument is normalized to a unit vector.
     * @param cutLine The direction of the start of the arrow slice. The argument is normalized to a unit vector.
     * @param clockwise The orientation
     */
    constructor(axis: VectorE3, cutLine: VectorE3, clockwise: boolean) {
        super();
        mustBeDefined('axis', axis);
        mustBeDefined('cutLine', cutLine);
        this.e = Vector3.copy(axis).normalize();
        this.cutLine = Vector3.copy(cutLine).normalize();
        this.clockwise = clockwise;
    }

    /**
     *
     */
    toPrimitive(): Primitive {

        /**
         * The opposite direction to the axis.
         */
        const back = Vector3.copy(this.e).neg();

        /**
         * The neck is the place where the cone meets the shaft. 
         */
        const neck = Vector3.copy(this.offset);
        neck.rotate(this.tilt);

        /**
         * The `cone` forms the head of the arrow.
         */
        const cone = new ConeBuilder();
        cone.height.copy(this.e).scale(this.heightCone);
        cone.cutLine.copy(this.cutLine).scale(this.radiusCone);
        cone.clockwise = this.clockwise;
        cone.tilt.mul(this.tilt);
        cone.offset.copy(neck);
        cone.sliceAngle = this.sliceAngle;
        cone.thetaSegments = this.thetaSegments;
        cone.useNormal = this.useNormal;
        cone.usePosition = this.usePosition;
        cone.useTextureCoord = this.useTextureCoord;

        /**
         * The `ring` fills the space between the cone and the shaft.
         */
        const ring = new RingBuilder();
        ring.e.copy(back);
        ring.cutLine.copy(this.cutLine);
        ring.clockwise = !this.clockwise;
        ring.innerRadius = this.radiusShaft;
        ring.outerRadius = this.radiusCone;
        ring.tilt.mul(this.tilt);
        ring.offset.copy(neck);
        ring.sliceAngle = this.sliceAngle;
        ring.thetaSegments = this.thetaSegments;
        ring.useNormal = this.useNormal;
        ring.usePosition = this.usePosition;
        ring.useTextureCoord = this.useTextureCoord;

        return reduce([cone.toPrimitive(), ring.toPrimitive()]);
    }
}
