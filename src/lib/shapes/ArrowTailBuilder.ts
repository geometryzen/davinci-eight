import { reduce } from '../atoms/reduce';
import { mustBeDefined } from '../checks/mustBeDefined';
import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { CylindricalShellBuilder } from './CylindricalShellBuilder';
import { RingBuilder } from './RingBuilder';
import { AxialShapeBuilder } from './AxialShapeBuilder';

/**
 * @hidden
 */
export class ArrowTailBuilder extends AxialShapeBuilder {

    public heightShaft = 0.80;
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
         * The tail is the the position of the blunt end of the arrow.
         */
        const tail = Vector3.copy(this.offset);
        tail.rotate(this.tilt);

        /**
         * The `shaft` is the slim part of the arrow.
         */
        const shaft = new CylindricalShellBuilder();
        shaft.height.copy(this.e).normalize().scale(this.heightShaft);
        shaft.cutLine.copy(this.cutLine).normalize().scale(this.radiusShaft);
        shaft.clockwise = this.clockwise;
        shaft.tilt.mul(this.tilt);
        shaft.offset.copy(tail);
        shaft.sliceAngle = this.sliceAngle;
        shaft.thetaSegments = this.thetaSegments;
        shaft.useNormal = this.useNormal;
        shaft.usePosition = this.usePosition;
        shaft.useTextureCoord = this.useTextureCoord;

        /**
         * The `plug` fills the end of the shaft.
         */
        const plug = new RingBuilder();
        plug.e.copy(back);
        plug.cutLine.copy(this.cutLine);
        plug.clockwise = !this.clockwise;
        plug.innerRadius = 0;
        plug.outerRadius = this.radiusShaft;
        plug.tilt.mul(this.tilt);
        plug.offset.copy(tail);
        plug.sliceAngle = this.sliceAngle;
        plug.thetaSegments = this.thetaSegments;
        plug.useNormal = this.useNormal;
        plug.usePosition = this.usePosition;
        plug.useTextureCoord = this.useTextureCoord;

        return reduce([shaft.toPrimitive(), plug.toPrimitive()]);
    }
}
