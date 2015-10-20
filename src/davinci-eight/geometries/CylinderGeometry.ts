import AxialGeometry = require('../geometries/AxialGeometry')
import Cartesian3 = require('../math/Cartesian3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GridTopology = require('../topologies/GridTopology')
import IGeometry = require('../geometries/IGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import MutableNumber = require('../math/MutableNumber')
import Spinor3 = require('../math/Spinor3')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

/**
 * @class CylinderGeometry
 */
class CylinderGeometry extends AxialGeometry implements IGeometry<CylinderGeometry> {
    /**
     * @property radius
     * @type {number}
     */
    public radius: number;
    /**
     * @property height
     * @type {number}
     */
    public height: number;
    /**
     * @property thetaSegments
     * @type {number}
     */
    public thetaSegments = 8;
    /**
     * @class CylinderGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    public setPosition(position: Cartesian3): CylinderGeometry {
        this.position = position
        return this
    }
    toPrimitives(): DrawPrimitive[] {
        let uSegments = this.thetaSegments
        let vSegments = 1
        let topo = new GridTopology(uSegments, vSegments)
        let axis = this.axis
        let generator = new Spinor3().dual(axis)

        for (let uIndex = 0; uIndex < topo.uLength; uIndex++) {
            let u = uIndex / uSegments
            let rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()
            for (let vIndex = 0; vIndex < topo.vLength; vIndex++) {
                let v = vIndex / vSegments
                let normal = Vector3.copy(this.sliceStart).rotate(rotor)
                let position = normal.clone().scale(this.radius).add(this.axis, v * this.height)
                let vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    enableTextureCoords(enable: boolean): CylinderGeometry {
        mustBeBoolean('enable', enable)
        this.useTextureCoords = enable
        return this
    }
}
export = CylinderGeometry