import AxialGeometry = require('../geometries/AxialGeometry')
import Cartesian3 = require('../math/Cartesian3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GridTopology = require('../topologies/GridTopology')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

/**
 * @class ConeGeometry
 */
class ConeGeometry extends AxialGeometry implements IAxialGeometry<ConeGeometry> {
    /**
     * @property radius
     * @type {number}
     */
    public radius: number = 1;
    /**
     * @property height
     * @type {number}
     */
    public height: number = 1;
    /**
     * @property thetaSegments
     * @type {number}
     */
    public thetaSegments = 16;
    /**
     * @class ConeGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    /**
     * @method setAxis
     * @param axis {Cartesian3}
     * @return {ConeGeometry}
     * @chainable
     */
    public setAxis(axis: Cartesian3): ConeGeometry {
        super.setAxis(axis)
        return this
    }
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {ConeGeometry}
     * @chainable
     */
    public setPosition(position: Cartesian3): ConeGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method tPrimitives
     * @return {DrawPrimitive[]}
     */
    public toPrimitives(): DrawPrimitive[] {
        console.log("ConeGeometry.toPrimitives()")
        var topo = new GridTopology(this.thetaSegments, 1)
        var uLength = topo.uLength
        var uSegments = uLength - 1
        var vLength = topo.vLength
        var vSegments = vLength - 1

        var a = Vector3.copy(this.sliceStart).normalize().scale(this.radius)
        var b = new Vector3().cross2(a, this.axis).normalize().scale(this.radius)
        var h = Vector3.copy(this.axis).scale(this.height)
        for (var uIndex = 0; uIndex < uLength; uIndex++) {
            var u = uIndex / uSegments
            var theta = this.sliceAngle * u
            var cosTheta = Math.cos(theta)
            var sinTheta = Math.sin(theta)
            for (var vIndex = 0; vIndex < vLength; vIndex++) {
                var v = vIndex / vSegments
                var position = new Vector3().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v)
                var peak = Vector3.copy(h).sub(position)
                var normal = new Vector3().cross2(peak, position).cross(peak).normalize()
                var vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    enableTextureCoords(enable: boolean): ConeGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}

export = ConeGeometry
