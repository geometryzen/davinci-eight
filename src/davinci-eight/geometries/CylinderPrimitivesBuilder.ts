import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import VectorE3 from '../math/VectorE3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTopology from './GridTopology';
import IAxialGeometry from './IAxialGeometry';
import SpinG3m from '../math/SpinG3m';
import Primitive from '../core/Primitive';
import R2m from '../math/R2m';
import R3m from '../math/R3m';

/**
 * This implementation only builds the walls of the cylinder (by wrapping a grid)
 */
export default class CylinderPrimitivesBuilder extends AxialPrimitivesBuilder implements IAxialGeometry<CylinderPrimitivesBuilder> {
    public radius: number = 1;
    public height: number = 1;
    public thetaSegments = 16;
    constructor(axis: VectorE3, sliceStart: VectorE3) {
        super(axis, sliceStart)
    }
    public setAxis(axis: VectorE3): CylinderPrimitivesBuilder {
        super.setAxis(axis)
        return this
    }
    public setPosition(position: VectorE3): CylinderPrimitivesBuilder {
        super.setPosition(position)
        return this
    }
    toPrimitives(): Primitive[] {
        const uSegments = this.thetaSegments
        const vSegments = 1
        const topo = new GridTopology(uSegments, vSegments)
        const axis = this.axis
        const generator = SpinG3m.dual(axis)

        for (let uIndex = 0; uIndex < topo.uLength; uIndex++) {
            const u = uIndex / uSegments

            const rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()

            for (let vIndex = 0; vIndex < topo.vLength; vIndex++) {
                const v = vIndex / vSegments
                const normal = R3m.copy(this.sliceStart).rotate(rotor)
                const position = normal.clone().scale(this.radius).add(this.axis, v * this.height)
                const vertex = topo.vertex(uIndex, vIndex)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2m([u, v])
                }
            }
        }
        return [topo.toDrawPrimitive()]
    }
    enableTextureCoords(enable: boolean): CylinderPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
