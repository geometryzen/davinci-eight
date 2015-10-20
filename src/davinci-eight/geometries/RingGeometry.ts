import Cartesian3 = require('../math/Cartesian3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GridTopology = require('../topologies/GridTopology')
import IGeometry = require('../geometries/IGeometry')
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
class RingGeometry extends AxialGeometry implements IGeometry<RingGeometry> {
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
    public thetaSegments = 8;
    /**
     * @class RingGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    public setPosition(position: Cartesian3): RingGeometry {
        this.position = position
        return this
    }
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
    enableTextureCoords(enable: boolean): RingGeometry {
        mustBeBoolean('enable', enable)
        this.useTextureCoords = enable
        return this
    }
}
export = RingGeometry