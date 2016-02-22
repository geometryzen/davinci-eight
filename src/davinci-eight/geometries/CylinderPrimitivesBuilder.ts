import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import VectorE3 from '../math/VectorE3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import TriangleStrip from './TriangleStrip';
import IAxialGeometry from './IAxialGeometry';
import Spinor3 from '../math/Spinor3';
import Primitive from '../core/Primitive';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';

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
        const uSegments = this.thetaSegments  // the u-coordinate goes around.
        const vSegments = 1  // the v-coordinate goes 'up'.
        const grid = new TriangleStrip(uSegments, vSegments)
        const axis = this.axis
        const generator = Spinor3.dual(axis)

        const uLen = grid.uLength;
        for (let uIndex = 0; uIndex < uLen; uIndex++) {
            const u = uIndex / uSegments

            const rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()

            const vLen = grid.vLength;
            for (let vIndex = 0; vIndex < vLen; vIndex++) {
                const v = vIndex / vSegments
                const normal = Vector3.copy(this.sliceStart).rotate(rotor)
                const position = normal.clone().scale(this.radius).add(this.axis, v * this.height)
                const vertex = grid.vertex(uIndex, vIndex)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v])
                }
            }
        }
        return [grid.toPrimitive()]
    }
    enableTextureCoords(enable: boolean): CylinderPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
