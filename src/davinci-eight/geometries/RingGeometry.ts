import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTopology from '../topologies/GridTopology';
import IAxialGeometry from '../geometries/IAxialGeometry';
import AxialGeometry from '../geometries/AxialGeometry';
import mustBeBoolean from '../checks/mustBeBoolean';
import Primitive from '../core/Primitive';
import R1 from '../math/R1';
import R2 from '../math/R2';
import G3 from '../math/G3';
import VectorE3 from '../math/VectorE3';

/**
 * @class RingGeometry
 */
export default class RingGeometry extends AxialGeometry implements IAxialGeometry<RingGeometry> {
    /**
     * @property innerRadius
     * @type {number}
     */
    public innerRadius: number = 0;
    /**
     * @property outerRadius
     * @type {number}
     */
    public outerRadius: number = 1;
    /**
     * @property thetaSegments
     * @type {number}
     */
    public thetaSegments = 16;
    /**
     * @class RingGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity. 
     * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart: VectorE3) {
        super(axis, sliceStart)
    }
    /**
     * @method setAxis
     * @param axis
     * @return {RingGeometry}
     * @chainable
     */
    public setAxis(axis: VectorE3): RingGeometry {
        super.setAxis(axis)
        return this
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {RingGeometry}
     * @chainable
     */
    public setPosition(position: VectorE3): RingGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
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
    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {RingGeometry}
     * @chainable
     */
    enableTextureCoords(enable: boolean): RingGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
