import Cartesian3 = require('../math/Cartesian3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GridTopology = require('../topologies/GridTopology')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import AxialGeometry = require('../geometries/AxialGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import MutableNumber = require('../math/MutableNumber')
import Spinor3 = require('../math/Spinor3')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

/**
 * @class RingGeometry
 */
class RingGeometry extends AxialGeometry implements IAxialGeometry<RingGeometry> {
    /**
     * @property innerRadius
     * @type {number}
     */
    public innerRadius: number = 0;
    /**
     * @property outerRadius
     * @type {number}
     */
    public outerRadius: number = 1;
    /**
     * @property thetaSegments
     * @type {number}
     */
    public thetaSegments = 16;
    /**
     * @class RingGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    /**
     * @method setAxis
     * @param axis
     * @return {RingGeometry}
     * @chainable
     */
    public setAxis(axis: Cartesian3): RingGeometry {
        super.setAxis(axis)
        return this
    }
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {RingGeometry}
     * @chainable
     */
    public setPosition(position: Cartesian3): RingGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[] {
        let uSegments = this.thetaSegments
        let vSegments = 1
        let topo = new GridTopology(uSegments, vSegments)
        let a = this.outerRadius
        let b = this.innerRadius
        let axis = Vector3.copy(this.axis)
        let start = Vector3.copy(this.sliceStart)
        let generator = new Spinor3().dual(this.axis)

        for (let uIndex = 0; uIndex < topo.uLength; uIndex++) {
            let u = uIndex / uSegments
            let rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()
            for (let vIndex = 0; vIndex < topo.vLength; vIndex++) {
                let v = vIndex / vSegments
                let position = start.clone().rotate(rotor).scale(b + (a - b) * v)
                let vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = axis
                if (this.useTextureCoords) {
                    vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {RingGeometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): RingGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
export = RingGeometry