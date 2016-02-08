import Euclidean3 from '../math/Euclidean3';
import GridTopology from '../topologies/GridTopology';
import PrimitivesBuilder from '../geometries/PrimitivesBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import IPrimitivesBuilder from '../geometries/IPrimitivesBuilder';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeNumber from '../checks/mustBeNumber';
import Primitive from '../core/Primitive';
import R3 from '../math/R3';
import R2 from '../math/R2';
import VectorE3 from '../math/VectorE3';

function side(basis: R3[], uSegments: number, vSegments: number): GridTopology {
    var normal = R3.copy(basis[0]).cross(basis[1]).direction()
    var aNeg = R3.copy(basis[0]).scale(-0.5)
    var aPos = R3.copy(basis[0]).scale(+0.5)
    var bNeg = R3.copy(basis[1]).scale(-0.5)
    var bPos = R3.copy(basis[1]).scale(+0.5)
    var cPos = R3.copy(basis[2]).scale(+0.5)
    var side = new GridTopology(uSegments, vSegments)
    for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
            var u = uIndex / uSegments
            var v = vIndex / vSegments
            var a = R3.copy(aNeg).lerp(aPos, u)
            var b = R3.copy(bNeg).lerp(bPos, v)
            var vertex = side.vertex(uIndex, vIndex)
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = R3.copy(a).add(b).add(cPos)
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v])
        }
    }
    return side
}

/**
 * @class CuboidGeometry
 */
export default class CuboidGeometry extends PrimitivesBuilder implements IPrimitivesBuilder<CuboidGeometry> {
    public iSegments: number = 1;
    public jSegments: number = 1;
    public kSegments: number = 1;
    private _a: R3 = R3.copy(Euclidean3.e1);
    private _b: R3 = R3.copy(Euclidean3.e2);
    private _c: R3 = R3.copy(Euclidean3.e3);
    private sides: GridTopology[];
    /**
     * @class CuboidGeometry
     * @constructor
     */
    constructor() {
        super()
        this.sides = []
    }
    /**
     * @property width
     * @type {number}
     */
    get width() {
        return this._a.magnitude()
    }
    set width(width: number) {
        mustBeNumber('width', width)
        this._a.direction().scale(width)
    }
    /**
     * @property height
     * @type {number}
     */
    get height() {
        return this._b.magnitude()
    }
    set height(height: number) {
        mustBeNumber('height', height)
        this._b.direction().scale(height)
    }
    /**
     * @property depth
     * @type {number}
     */
    get depth() {
        return this._c.magnitude()
    }
    set depth(depth: number) {
        mustBeNumber('depth', depth)
        this._c.direction().scale(depth)
    }
    private regenerate(): void {
        this.sides = []
        // front
        this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments))
        // right
        this.sides.push(side([R3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments))
        // left
        this.sides.push(side([this._c, this._b, R3.copy(this._a).scale(-1)], this.kSegments, this.jSegments))
        // back
        this.sides.push(side([R3.copy(this._a).scale(-1), this._b, R3.copy(this._c).scale(-1)], this.iSegments, this.jSegments))
        // top
        this.sides.push(side([this._a, R3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments))
        // bottom
        this.sides.push(side([this._a, this._c, R3.copy(this._b).scale(-1)], this.iSegments, this.kSegments))
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {CuboidGeometry}
     */
    public setPosition(position: VectorE3): CuboidGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    public toPrimitives(): Primitive[] {
        this.regenerate()
        return this.sides.map((side) => { return side.toDrawPrimitive() })
    }
    enableTextureCoords(enable: boolean): CuboidGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
