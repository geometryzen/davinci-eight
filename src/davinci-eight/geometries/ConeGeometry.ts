import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import VectorE3 from '../math/VectorE3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTopology from './GridTopology';
import IAxialGeometry from './IAxialGeometry';
import Primitive from '../core/Primitive';
import R2m from '../math/R2m';
import R3m from '../math/R3m';

export default class ConeGeometry extends AxialPrimitivesBuilder implements IAxialGeometry<ConeGeometry> {
    public radius: number = 1;
    public height: number = 1;
    public thetaSegments = 16;
    constructor(axis: VectorE3, sliceStart: VectorE3) {
        super(axis, sliceStart)
    }
    public setAxis(axis: VectorE3): ConeGeometry {
        super.setAxis(axis)
        return this
    }
    public setPosition(position: VectorE3): ConeGeometry {
        super.setPosition(position)
        return this
    }
    public toPrimitives(): Primitive[] {
        var topo = new GridTopology(this.thetaSegments, 1)
        var uLength = topo.uLength
        var uSegments = uLength - 1
        var vLength = topo.vLength
        var vSegments = vLength - 1

        var a = R3m.copy(this.sliceStart).direction().scale(this.radius)
        var b = new R3m().cross2(a, this.axis).direction().scale(this.radius)
        var h = R3m.copy(this.axis).scale(this.height)
        for (var uIndex = 0; uIndex < uLength; uIndex++) {
            var u = uIndex / uSegments
            var theta = this.sliceAngle * u
            var cosTheta = Math.cos(theta)
            var sinTheta = Math.sin(theta)
            for (var vIndex = 0; vIndex < vLength; vIndex++) {
                var v = vIndex / vSegments
                var position = new R3m().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v)
                var peak = R3m.copy(h).sub(position)
                var normal = new R3m().cross2(peak, position).cross(peak).direction()
                var vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2m([u, v])
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
