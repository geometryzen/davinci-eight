import VectorE3 = require('../math/VectorE3')
import ConeGeometry = require('../geometries/ConeGeometry')
import CylinderGeometry = require('../geometries/CylinderGeometry')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import AxialGeometry = require('../geometries/AxialGeometry')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
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
     */
    constructor() {
        super()
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
     * @chaninable
     */
    setAxis(axis: VectorE3): ArrowGeometry {
        super.setAxis(axis)
        return this
    }
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[] {
        console.log("ArrowGeometry.toPrimitives()")
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

        let cone = new ConeGeometry()
        cone.radius = this.radiusCone
        cone.height = this.heightCone
        cone.position = neck
        cone.axis = this.axis
        cone.sliceAngle = this.sliceAngle
        cone.sliceStart = this.sliceStart
        cone.thetaSegments = this.thetaSegments
        cone.useTextureCoords = this.useTextureCoords
        /**
         * The `disc` fills the space between the cone and the shaft.
         */
        let disc = new RingGeometry()
        disc.innerRadius = this.radiusShaft
        disc.outerRadius = this.radiusCone
        disc.position = neck
        disc.axis = back
        disc.sliceAngle = -this.sliceAngle
        disc.sliceStart = this.sliceStart
        disc.thetaSegments = this.thetaSegments
        disc.useTextureCoords = this.useTextureCoords
        /**
         * The `shaft` is the slim part of the arrow.
         */
        let shaft = new CylinderGeometry()
        shaft.radius = this.radiusShaft
        shaft.height = heightShaft
        shaft.position = tail
        shaft.axis = this.axis
        shaft.sliceAngle = this.sliceAngle
        shaft.sliceStart = this.sliceStart
        shaft.thetaSegments = this.thetaSegments
        shaft.useTextureCoords = this.useTextureCoords
        /**
         * The `plug` fills the end of the shaft.
         */
        let plug = new RingGeometry()
        plug.innerRadius = 0
        plug.outerRadius = this.radiusShaft
        plug.position = tail
        plug.axis = back
        plug.sliceAngle = -this.sliceAngle
        plug.sliceStart = this.sliceStart
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