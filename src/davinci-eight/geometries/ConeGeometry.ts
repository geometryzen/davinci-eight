import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import VectorE3 from '../math/VectorE3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import TriangleStrip from './TriangleStrip';
import IAxialGeometry from './IAxialGeometry';
import Primitive from '../core/Primitive';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';

/**
 * This implementation currently only generates the wall of the cone
 */
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
        const grid = new TriangleStrip(this.thetaSegments, 1)
        const uLength = grid.uLength
        const uSegments = uLength - 1
        const vLength = grid.vLength
        const vSegments = vLength - 1

        const a = Vector3.copy(this.sliceStart).direction().scale(this.radius)
        const b = new Vector3().cross2(a, this.axis).direction().scale(this.radius)
        const h = Vector3.copy(this.axis).scale(this.height)
        for (let uIndex = 0; uIndex < uLength; uIndex++) {
            const u = uIndex / uSegments
            const theta = this.sliceAngle * u
            const cosTheta = Math.cos(theta)
            const sinTheta = Math.sin(theta)
            for (let vIndex = 0; vIndex < vLength; vIndex++) {
                const v = vIndex / vSegments
                const position = new Vector3().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v)
                const peak = Vector3.copy(h).sub(position)
                const normal = new Vector3().cross2(peak, position).cross(peak).direction()
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
    enableTextureCoords(enable: boolean): ConeGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
