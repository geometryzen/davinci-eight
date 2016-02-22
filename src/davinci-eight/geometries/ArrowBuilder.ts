import VectorE3 from '../math/VectorE3';
import ConeGeometry from '../geometries/ConeGeometry';
import CylinderPrimitivesBuilder from '../geometries/CylinderPrimitivesBuilder';
import AxialPrimitivesBuilder from '../geometries/AxialPrimitivesBuilder';
import IAxialGeometry from '../geometries/IAxialGeometry';
import Primitive from '../core/Primitive';
import RingBuilder from '../geometries/RingBuilder';
import Vector3 from '../math/Vector3';

export default class ArrowBuilder extends AxialPrimitivesBuilder implements IAxialGeometry<ArrowBuilder> {
    public heightCone: number = 0.20;
    public radiusCone: number = 0.08;
    public radiusShaft: number = 0.01;
    public thetaSegments = 16;
    constructor(axis: VectorE3, sliceStart?: VectorE3) {
        super(axis, sliceStart)
    }
    setPosition(position: VectorE3): ArrowBuilder {
        super.setPosition(position)
        return this
    }
    setAxis(axis: VectorE3): ArrowBuilder {
        super.setAxis(axis)
        return this
    }
    toPrimitives(): Primitive[] {
        const heightShaft = 1 - this.heightCone
        /**
         * The opposite direction to the axis.
         */
        const back = Vector3.copy(this.axis).scale(-1)
        /**
         * The neck is the place where the cone meets the shaft. 
         */
        const neck = Vector3.copy(this.axis).scale(heightShaft).add(this.position)
        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        const tail = Vector3.copy(this.position)

        const cone = new ConeGeometry(this.axis, this.sliceStart)
        cone.radius = this.radiusCone
        cone.height = this.heightCone
        cone.setPosition(neck)
        cone.axis = this.axis
        cone.sliceAngle = this.sliceAngle
        cone.thetaSegments = this.thetaSegments
        cone.useTextureCoords = this.useTextureCoords
        /**
         * The `disc` fills the space between the cone and the shaft.
         */
        const disc = new RingBuilder(back, this.sliceStart)
        disc.innerRadius = this.radiusShaft
        disc.outerRadius = this.radiusCone
        disc.setPosition(neck)
        disc.sliceAngle = -this.sliceAngle
        disc.thetaSegments = this.thetaSegments
        disc.useTextureCoords = this.useTextureCoords
        /**
         * The `shaft` is the slim part of the arrow.
         */
        const shaft = new CylinderPrimitivesBuilder(this.axis, this.sliceStart)
        shaft.radius = this.radiusShaft
        shaft.height = heightShaft
        shaft.setPosition(tail)
        shaft.sliceAngle = this.sliceAngle
        shaft.thetaSegments = this.thetaSegments
        shaft.useTextureCoords = this.useTextureCoords
        /**
         * The `plug` fills the end of the shaft.
         */
        const plug = new RingBuilder(back, this.sliceStart)
        plug.innerRadius = 0
        plug.outerRadius = this.radiusShaft
        plug.setPosition(tail)
        plug.sliceAngle = -this.sliceAngle
        plug.thetaSegments = this.thetaSegments
        plug.useTextureCoords = this.useTextureCoords

        return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce((a, b) => { return a.concat(b) }, [])
    }
    enableTextureCoords(enable: boolean): ArrowBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
