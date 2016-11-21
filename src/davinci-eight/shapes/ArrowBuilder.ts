import AxialShapeBuilder from './AxialShapeBuilder';
import ConicalShellBuilder from '../shapes/ConicalShellBuilder';
import CylindricalShellBuilder from '../shapes/CylindricalShellBuilder';
import mustBeDefined from '../checks/mustBeDefined';
import Primitive from '../core/Primitive';
import reduce from '../atoms/reduce';
import RingBuilder from '../shapes/RingBuilder';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 * <p>
 * This class does not default the initial <b>axis</b>.
 * </p>
 * <p>
 * This class does not default the <b>cutLine</b>.
 * </p>
 */
export default class ArrowBuilder extends AxialShapeBuilder {

    public heightCone: number = 0.20;

    public radiusCone: number = 0.08;

    public radiusShaft: number = 0.01;

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

        const heightShaft = 1 - this.heightCone;
        /**
         * The opposite direction to the axis.
         */
        const back = Vector3.copy(this.e).neg();

        /**
         * The neck is the place where the cone meets the shaft. 
         */
        const neck = Vector3.copy(this.e).scale(heightShaft).add(this.offset);
        neck.rotate(this.tilt);

        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        const tail = Vector3.copy(this.offset);
        tail.rotate(this.tilt);

        /**
         * The `cone` forms the head of the arrow.
         */
        const cone = new ConicalShellBuilder();
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

        /**
         * The `shaft` is the slim part of the arrow.
         */
        const shaft = new CylindricalShellBuilder();
        shaft.height.copy(this.e).normalize().scale(heightShaft);
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

        return reduce([cone.toPrimitive(), ring.toPrimitive(), shaft.toPrimitive(), plug.toPrimitive()]);
    }
}
