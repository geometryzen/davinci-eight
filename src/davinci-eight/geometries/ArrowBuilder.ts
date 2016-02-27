import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import ConicalShellBuilder from './ConicalShellBuilder';
import CylindricalShellBuilder from './CylindricalShellBuilder';
import GeometryBuilder from './GeometryBuilder'
import Primitive from '../core/Primitive'
import RingBuilder from '../geometries/RingBuilder'
import R3 from '../math/R3'
import Vector3 from '../math/Vector3'
import VectorE3 from '../math/VectorE3'

/**
 * @class ArrowBuilder
 * @extends AxialPrimitivesBuilder
 */
export default class ArrowBuilder extends AxialPrimitivesBuilder implements GeometryBuilder {

    /**
     * @property heightCone
     * @type number
     * @default 0.2
     */
    public heightCone: number = 0.20;

    /**
     * @property radiusCone
     * @type number
     * @default 0.08
     */
    public radiusCone: number = 0.08;

    /**
     * @property radiusShaft
     * @type number
     * @default 0.01
     */
    public radiusShaft: number = 0.01;

    /**
     * @property thetaSegments
     * @type number
     * @default 16
     */
    public thetaSegments = 16;

    private e: R3;
    private cutLine: R3;
    private clockwise: boolean;

    /**
     * @class ArrowBuilder
     * @constructor
     */
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean) {
        super()
        this.e = R3.direction(e)
        this.cutLine = R3.direction(cutLine)
        this.clockwise = clockwise
    }

    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[] {

        const heightShaft = 1 - this.heightCone
        /**
         * The opposite direction to the axis.
         */
        const back = this.e.neg()

        /**
         * The neck is the place where the cone meets the shaft. 
         */
        const neck = Vector3.copy(this.e).scale(heightShaft).add(this.offset)
        neck.rotate(this.tilt)

        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        const tail = Vector3.copy(this.offset)
        tail.rotate(this.tilt)

        /**
         * The `cone` forms the head of the arrow.
         */
        const cone = new ConicalShellBuilder(this.e, this.cutLine, this.clockwise)
        // Use the radius and height helpers instead of the scale.
        cone.radius = this.radiusCone
        cone.height = this.heightCone
        cone.tilt.mul(this.tilt)
        cone.offset.copy(neck)
        cone.sliceAngle = this.sliceAngle
        cone.thetaSegments = this.thetaSegments
        cone.useNormal = this.useNormal
        cone.usePosition = this.usePosition
        cone.useTextureCoord = this.useTextureCoord

        /**
         * The `disc` fills the space between the cone and the shaft.
         */
        const disc = new RingBuilder(back, this.cutLine, !this.clockwise)
        disc.innerRadius = this.radiusShaft
        disc.outerRadius = this.radiusCone
        disc.tilt.mul(this.tilt)
        disc.offset.copy(neck)
        disc.sliceAngle = this.sliceAngle
        disc.thetaSegments = this.thetaSegments
        disc.useNormal = this.useNormal
        disc.usePosition = this.usePosition
        disc.useTextureCoord = this.useTextureCoord

        /**
         * The `shaft` is the slim part of the arrow.
         */
        const shaft = new CylindricalShellBuilder(this.e, this.cutLine, this.clockwise)
        shaft.radius = this.radiusShaft
        shaft.height = heightShaft
        shaft.tilt.mul(this.tilt)
        shaft.offset.copy(tail)
        shaft.sliceAngle = this.sliceAngle
        shaft.thetaSegments = this.thetaSegments
        shaft.useNormal = this.useNormal
        shaft.usePosition = this.usePosition
        shaft.useTextureCoord = this.useTextureCoord

        /**
         * The `plug` fills the end of the shaft.
         */
        const plug = new RingBuilder(back, this.cutLine, !this.clockwise)
        plug.innerRadius = 0
        plug.outerRadius = this.radiusShaft
        plug.tilt.mul(this.tilt)
        plug.offset.copy(tail)
        plug.sliceAngle = this.sliceAngle
        plug.thetaSegments = this.thetaSegments
        plug.useNormal = this.useNormal
        plug.usePosition = this.usePosition
        plug.useTextureCoord = this.useTextureCoord

        return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce((a, b) => { return a.concat(b) }, [])
    }
}
