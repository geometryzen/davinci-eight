import GridTriangleStrip from '../atoms/GridTriangleStrip'
import PrimitivesBuilder from './PrimitivesBuilder'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import mustBeNumber from '../checks/mustBeNumber'
import Primitive from '../core/Primitive'
import SpinorE3 from '../math/SpinorE3'
import Spinor3 from '../math/Spinor3'
import Vector3 from '../math/Vector3'
import {Vector2} from '../math/Vector2'

function side(tilt: SpinorE3, offset: Vector3, basis: Vector3[], uSegments: number, vSegments: number): GridTriangleStrip {

    // The normal will be the same for all vertices in the side, so we compute it once here.
    // Perform the stress ant tilt transformations on the tangent bivector before computing the normal.
    const tangent = Spinor3.wedge(basis[0], basis[1]).rotate(tilt)
    const normal = Vector3.dual(tangent, true).normalize()

    const aNeg = Vector3.copy(basis[0]).scale(-0.5)
    const aPos = Vector3.copy(basis[0]).scale(+0.5)
    const bNeg = Vector3.copy(basis[1]).scale(-0.5)
    const bPos = Vector3.copy(basis[1]).scale(+0.5)
    const cPos = Vector3.copy(basis[2]).scale(+0.5)
    const side = new GridTriangleStrip(uSegments, vSegments)
    for (let uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (let vIndex = 0; vIndex < side.vLength; vIndex++) {
            const u = uIndex / uSegments
            const v = vIndex / vSegments
            const a = Vector3.copy(aNeg).lerp(aPos, u)
            const b = Vector3.copy(bNeg).lerp(bPos, v)
            const vertex = side.vertex(uIndex, vIndex)

            const position = Vector3.copy(a).add(b).add(cPos)

            // Perform the stress, tilt, offset transformations (in that order)
            position.rotate(tilt)
            position.add(offset)

            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2([u, v])
        }
    }
    return side
}

export default class CuboidPrimitivesBuilder extends PrimitivesBuilder {

    /**
     * @default 1
     */
    public iSegments: number = 1;

    /**
     * @default 1
     */
    public jSegments: number = 1;

    /**
     * @default 1
     */
    public kSegments: number = 1;

    /**
     * @default false
     */
    public openBack = false;

    /**
     * @default false
     */
    public openBase = false;

    /**
     * @default false
     */
    public openFront = false;

    /**
     * @default false
     */
    public openLeft = false;

    /**
     * @default false
     */
    public openRight = false;

    /**
     * @default false
     */
    public openCap = false;

    private _a: Vector3 = Vector3.vector(1, 0, 0);
    private _b: Vector3 = Vector3.vector(0, 1, 0);
    private _c: Vector3 = Vector3.vector(0, 0, 1);

    private sides: GridTriangleStrip[];

    constructor() {
        super()
        this.sides = []
    }

    get width() {
        return this._a.magnitude()
    }
    set width(width: number) {
        mustBeNumber('width', width)
        this._a.normalize().scale(width)
    }

    get height() {
        return this._b.magnitude()
    }
    set height(height: number) {
        mustBeNumber('height', height)
        this._b.normalize().scale(height)
    }

    get depth() {
        return this._c.magnitude()
    }
    set depth(depth: number) {
        mustBeNumber('depth', depth)
        this._c.normalize().scale(depth)
    }

    /**
     * Creates six TRIANGLE_STRIP faces using the GridTriangleStrip helper.
     */
    private regenerate(): void {
        this.sides = []
        const t = this.tilt
        const o = this.offset
        if (!this.openFront) {
            this.sides.push(side(t, o, [this._a, this._b, this._c], this.iSegments, this.jSegments))
        }
        if (!this.openRight) {
            this.sides.push(side(t, o, [Vector3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments))
        }
        if (!this.openLeft) {
            this.sides.push(side(t, o, [this._c, this._b, Vector3.copy(this._a).scale(-1)], this.kSegments, this.jSegments))
        }
        if (!this.openBack) {
            this.sides.push(side(t, o, [Vector3.copy(this._a).scale(-1), this._b, Vector3.copy(this._c).scale(-1)], this.iSegments, this.jSegments))
        }
        if (!this.openCap) {
            this.sides.push(side(t, o, [this._a, Vector3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments))
        }
        if (!this.openBase) {
            this.sides.push(side(t, o, [this._a, this._c, Vector3.copy(this._b).scale(-1)], this.iSegments, this.kSegments))
        }
    }

    public toPrimitives(): Primitive[] {
        this.regenerate();
        return this.sides.map((side) => { return side.toPrimitive() });
    }
}
