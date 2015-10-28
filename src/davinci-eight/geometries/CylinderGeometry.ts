import AxialGeometry = require('../geometries/AxialGeometry')
import VectorE3 = require('../math/VectorE3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GridTopology = require('../topologies/GridTopology')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustBeNumber = require('../checks/mustBeNumber')
import R1 = require('../math/R1')
import SpinG3 = require('../math/SpinG3')
import Symbolic = require('../core/Symbolic')
import R2 = require('../math/R2')
import R3 = require('../math/R3')

/**
 * @class CylinderGeometry
 */
class CylinderGeometry extends AxialGeometry implements IAxialGeometry<CylinderGeometry> {
    /**
     * @property radius
     * @type {number}
     * @default 1
     */
    public radius: number = 1;
    /**
     * @property height
     * @type {number}
     * @default 1
     */
    public height: number = 1;
    /**
     * @property thetaSegments
     * @type {number}
     * @default 16
     */
    public thetaSegments = 16;
    /**
     * @class CylinderGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    public setAxis(axis: VectorE3): CylinderGeometry {
        super.setAxis(axis)
        return this
    }
    public setPosition(position: VectorE3): CylinderGeometry {
        super.setPosition(position)
        return this
    }
    toPrimitives(): DrawPrimitive[] {
        let uSegments = this.thetaSegments
        let vSegments = 1
        let topo = new GridTopology(uSegments, vSegments)
        let axis = this.axis
        let generator = SpinG3.dual(axis)

        for (let uIndex = 0; uIndex < topo.uLength; uIndex++) {
            let u = uIndex / uSegments
            let rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()
            for (let vIndex = 0; vIndex < topo.vLength; vIndex++) {
                let v = vIndex / vSegments
                let normal = R3.copy(this.sliceStart).rotate(rotor)
                let position = normal.clone().scale(this.radius).add(this.axis, v * this.height)
                let vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    enableTextureCoords(enable: boolean): CylinderGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
export = CylinderGeometry