import VectorE3 = require('../math/VectorE3')
import ConeGeometry = require('../geometries/ConeGeometry')
import CylinderGeometry = require('../geometries/CylinderGeometry')
import AxialGeometry = require('../geometries/AxialGeometry')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import Primitive = require('../geometries/Primitive')
import RingGeometry = require('../geometries/RingGeometry')
import R3 = require('../math/R3')

/**
 * @class ArrowGeometry
 */
class ArrowGeometry extends AxialGeometry implements IAxialGeometry<ArrowGeometry> {
    /**
     * @property heightCone
     * @type {number}
     */
    public heightCone: number = 0.20;
    /**
     * @property radiusCone
     * @type {number}
     */
    public radiusCone: number = 0.08;
    /**
     * @property radiusShaft
     * @type {number}
     */
    public radiusShaft: number = 0.01;
    /**
     * @property thetaSegments
     * @type {number}
     */
    public thetaSegments = 16;
    /**
     * @class ArrowGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity. 
     * @param sliceStart [VectorE3] A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart?: VectorE3) {
        super(axis, sliceStart)
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {ArrowGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): ArrowGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {ArrowGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): ArrowGeometry {
        super.setAxis(axis)
        return this
    }
    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[] {
        let heightShaft = 1 - this.heightCone
        /**
         * The opposite direction to the axis.
         */
        let back = R3.copy(this.axis).scale(-1)
        /**
         * The neck is the place where the cone meets the shaft. 
         */
        let neck = R3.copy(this.axis).scale(heightShaft).add(this.position)
        /**
         * The tail is the the position of the blunt end of the arrow.
         */
        let tail = R3.copy(this.position)

        let cone = new ConeGeometry(this.axis, this.sliceStart)
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
        let disc = new RingGeometry(back, this.sliceStart)
        disc.innerRadius = this.radiusShaft
        disc.outerRadius = this.radiusCone
        disc.setPosition(neck)
        disc.sliceAngle = -this.sliceAngle
        disc.thetaSegments = this.thetaSegments
        disc.useTextureCoords = this.useTextureCoords
        /**
         * The `shaft` is the slim part of the arrow.
         */
        let shaft = new CylinderGeometry(this.axis, this.sliceStart)
        shaft.radius = this.radiusShaft
        shaft.height = heightShaft
        shaft.setPosition(tail)
        shaft.sliceAngle = this.sliceAngle
        shaft.thetaSegments = this.thetaSegments
        shaft.useTextureCoords = this.useTextureCoords
        /**
         * The `plug` fills the end of the shaft.
         */
        let plug = new RingGeometry(back, this.sliceStart)
        plug.innerRadius = 0
        plug.outerRadius = this.radiusShaft
        plug.setPosition(tail)
        plug.sliceAngle = -this.sliceAngle
        plug.thetaSegments = this.thetaSegments
        plug.useTextureCoords = this.useTextureCoords

        return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce((a, b) => { return a.concat(b) }, [])
    }
    enableTextureCoords(enable: boolean): ArrowGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
export = ArrowGeometry