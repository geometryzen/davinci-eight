import G3 from '../math/G3';
import TriangleStrip from './TriangleStrip';
import PrimitivesBuilder from './PrimitivesBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import IPrimitivesBuilder from './IPrimitivesBuilder';
import mustBeNumber from '../checks/mustBeNumber';
import Primitive from '../core/Primitive';
import Vector3 from '../math/Vector3';
import Vector2 from '../math/Vector2';
import VectorE3 from '../math/VectorE3';

function side(basis: Vector3[], uSegments: number, vSegments: number): TriangleStrip {
    const normal = Vector3.copy(basis[0]).cross(basis[1]).direction()
    const aNeg = Vector3.copy(basis[0]).scale(-0.5)
    const aPos = Vector3.copy(basis[0]).scale(+0.5)
    const bNeg = Vector3.copy(basis[1]).scale(-0.5)
    const bPos = Vector3.copy(basis[1]).scale(+0.5)
    const cPos = Vector3.copy(basis[2]).scale(+0.5)
    const side = new TriangleStrip(uSegments, vSegments)
    for (let uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (let vIndex = 0; vIndex < side.vLength; vIndex++) {
            const u = uIndex / uSegments
            const v = vIndex / vSegments
            const a = Vector3.copy(aNeg).lerp(aPos, u)
            const b = Vector3.copy(bNeg).lerp(bPos, v)
            const vertex = side.vertex(uIndex, vIndex)
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = Vector3.copy(a).add(b).add(cPos)
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v])
        }
    }
    return side
}

export default class CuboidPrimitivesBuilder extends PrimitivesBuilder implements IPrimitivesBuilder<CuboidPrimitivesBuilder> {
    public iSegments: number = 1;
    public jSegments: number = 1;
    public kSegments: number = 1;
    private _a: Vector3 = Vector3.copy(G3.e1);
    private _b: Vector3 = Vector3.copy(G3.e2);
    private _c: Vector3 = Vector3.copy(G3.e3);
    private sides: TriangleStrip[];
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
        this.sides.push(side([Vector3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments))
        // left
        this.sides.push(side([this._c, this._b, Vector3.copy(this._a).scale(-1)], this.kSegments, this.jSegments))
        // back
        this.sides.push(side([Vector3.copy(this._a).scale(-1), this._b, Vector3.copy(this._c).scale(-1)], this.iSegments, this.jSegments))
        // top
        this.sides.push(side([this._a, Vector3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments))
        // bottom
        this.sides.push(side([this._a, this._c, Vector3.copy(this._b).scale(-1)], this.iSegments, this.kSegments))
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
        return this.sides.map((side) => { return side.toPrimitive() })
    }
    enableTextureCoords(enable: boolean): CuboidPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
