import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import TriangleStrip from './TriangleStrip';
import IAxialGeometry from './IAxialGeometry';
import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import Primitive from '../core/Primitive';
import Vector2 from '../math/Vector2';
import Geometric3 from '../math/Geometric3';
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
        const uSegments = this.thetaSegments
        const vSegments = 1
        const grid = new TriangleStrip(uSegments, vSegments)
        const a = this.outerRadius
        const b = this.innerRadius
        const axis = Geometric3.fromVector(this.axis)
        const start = Geometric3.fromVector(this.sliceStart)
        const generator = new Geometric3().dual(axis)

        for (let uIndex = 0; uIndex < grid.uLength; uIndex++) {
            const u = uIndex / uSegments
            const rotor = generator.clone().scale(this.sliceAngle * u / 2).exp()
            for (let vIndex = 0; vIndex < grid.vLength; vIndex++) {
                const v = vIndex / vSegments
                const position = start.clone().rotate(rotor).scale(b + (a - b) * v)
                const vertex = grid.vertex(uIndex, vIndex)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position.addVector(this.position)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = axis
                if (this.useTextureCoords) {
                    vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v])
                }
            }
        }
        return [grid.toPrimitive()]
    }
    enableTextureCoords(enable: boolean): RingBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
