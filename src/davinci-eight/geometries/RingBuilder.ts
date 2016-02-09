import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTopology from '../topologies/GridTopology';
import IAxialGeometry from '../geometries/IAxialGeometry';
import AxialPrimitivesBuilder from '../geometries/AxialPrimitivesBuilder';
import Primitive from '../core/Primitive';
import R2 from '../math/R2';
import G3 from '../math/G3';
import VectorE3 from '../math/VectorE3';

export default class RingBuilder extends AxialPrimitivesBuilder implements IAxialGeometry<RingBuilder> {
    public innerRadius: number = 0;
    public outerRadius: number = 1;
    public thetaSegments = 16;
    constructor(axis: VectorE3, sliceStart: VectorE3) {
        super(axis, sliceStart)
    }
    public setAxis(axis: VectorE3): RingBuilder {
        super.setAxis(axis)
        return this
    }
    public setPosition(position: VectorE3): RingBuilder {
        super.setPosition(position)
        return this
    }
    toPrimitives(): Primitive[] {
        let uSegments = this.thetaSegments
        let vSegments = 1
        let topo = new GridTopology(uSegments, vSegments)
        let a = this.outerRadius
        let b = this.innerRadius
        let axis = G3.fromVector(this.axis)
        let start = G3.fromVector(this.sliceStart)
        let generator = new G3().dual(axis)

        for (let uIndex = 0; uIndex < topo.uLength; uIndex++) {
            let u = uIndex / uSegments
            let rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()
            for (let vIndex = 0; vIndex < topo.vLength; vIndex++) {
                let v = vIndex / vSegments
                let position = start.clone().rotate(rotor).scale(b + (a - b) * v)
                let vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position.addVector(this.position)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = axis
                if (this.useTextureCoords) {
                    vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    enableTextureCoords(enable: boolean): RingBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
