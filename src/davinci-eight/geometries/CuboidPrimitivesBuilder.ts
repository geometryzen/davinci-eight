import G3 from '../math/G3';
import GridTopology from './GridTopology';
import PrimitivesBuilder from './PrimitivesBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import IPrimitivesBuilder from './IPrimitivesBuilder';
import mustBeNumber from '../checks/mustBeNumber';
import Primitive from '../core/Primitive';
import R3m from '../math/R3m';
import R2m from '../math/R2m';
import VectorE3 from '../math/VectorE3';

function side(basis: R3m[], uSegments: number, vSegments: number): GridTopology {
    var normal = R3m.copy(basis[0]).cross(basis[1]).direction()
    var aNeg = R3m.copy(basis[0]).scale(-0.5)
    var aPos = R3m.copy(basis[0]).scale(+0.5)
    var bNeg = R3m.copy(basis[1]).scale(-0.5)
    var bPos = R3m.copy(basis[1]).scale(+0.5)
    var cPos = R3m.copy(basis[2]).scale(+0.5)
    var side = new GridTopology(uSegments, vSegments)
    for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
            var u = uIndex / uSegments
            var v = vIndex / vSegments
            var a = R3m.copy(aNeg).lerp(aPos, u)
            var b = R3m.copy(bNeg).lerp(bPos, v)
            var vertex = side.vertex(uIndex, vIndex)
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = R3m.copy(a).add(b).add(cPos)
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2m([u, v])
        }
    }
    return side
}

export default class CuboidPrimitivesBuilder extends PrimitivesBuilder implements IPrimitivesBuilder<CuboidPrimitivesBuilder> {
    public iSegments: number = 1;
    public jSegments: number = 1;
    public kSegments: number = 1;
    private _a: R3m = R3m.copy(G3.e1);
    private _b: R3m = R3m.copy(G3.e2);
    private _c: R3m = R3m.copy(G3.e3);
    private sides: GridTopology[];
    /**
     * @class CuboidPrimitivesBuilder
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
        this.sides.push(side([R3m.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments))
        // left
        this.sides.push(side([this._c, this._b, R3m.copy(this._a).scale(-1)], this.kSegments, this.jSegments))
        // back
        this.sides.push(side([R3m.copy(this._a).scale(-1), this._b, R3m.copy(this._c).scale(-1)], this.iSegments, this.jSegments))
        // top
        this.sides.push(side([this._a, R3m.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments))
        // bottom
        this.sides.push(side([this._a, this._c, R3m.copy(this._b).scale(-1)], this.iSegments, this.kSegments))
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {CuboidPrimitivesBuilder}
     */
    public setPosition(position: VectorE3): CuboidPrimitivesBuilder {
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
    enableTextureCoords(enable: boolean): CuboidPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
