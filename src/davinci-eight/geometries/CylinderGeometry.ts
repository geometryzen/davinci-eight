import AxialPrimitivesBuilder from '../geometries/AxialPrimitivesBuilder';
import VectorE3 from '../math/VectorE3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTopology from '../topologies/GridTopology';
import IAxialGeometry from '../geometries/IAxialGeometry';
import SpinG3 from '../math/SpinG3';
import Primitive from '../core/Primitive';
import R2 from '../math/R2';
import R3 from '../math/R3';

/**
 * @module EIGHT
 * @submodule geometries
 */

/**
 * @class CylinderGeometry
 */
export default class CylinderGeometry extends AxialPrimitivesBuilder implements IAxialGeometry<CylinderGeometry> {
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
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity. 
     * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart: VectorE3) {
        super(axis, sliceStart)
    }
    public setAxis(axis: VectorE3): CylinderGeometry {
        super.setAxis(axis)
        return this
    }
    public setPosition(position: VectorE3): CylinderGeometry {
        super.setPosition(position)
        return this
    }
    toPrimitives(): Primitive[] {
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
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position.add(this.position)
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
                if (this.useTextureCoords) {
                    vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v])
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
