import BoxGeometryOptions from './BoxGeometryOptions';
import ContextManager from '../core/ContextManager';
import GeometryElements from '../core/GeometryElements';
import notSupported from '../i18n/notSupported';
import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeNumber from '../checks/mustBeNumber';
import Primitive from '../core/Primitive';
import reduce from '../atoms/reduce';
import GridTriangleStrip from '../atoms/GridTriangleStrip'
import PrimitivesBuilder from './PrimitivesBuilder'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import SpinorE3 from '../math/SpinorE3'
import Spinor3 from '../math/Spinor3'
import { Vector2 } from '../math/Vector2'
import computeFaceNormals from '../geometries/computeFaceNormals';
import R3 from '../math/R3';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import quad from '../geometries/quadrilateral';
import Simplex from '../geometries/Simplex';
import Vector1 from '../math/Vector1';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

const DEFAULT_A = R3(1, 0, 0);
const DEFAULT_B = R3(0, 1, 0);
const DEFAULT_C = R3(0, 0, 1);

class CuboidSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    private _a: VectorE3;
    private _b: VectorE3;
    private _c: VectorE3;
    private _isModified: boolean = true;
    constructor(a: VectorE3, b: VectorE3, c: VectorE3, k = Simplex.TRIANGLE, subdivide = 0, boundary = 0) {
        super()
        this._a = Vector3.copy(a)
        this._b = Vector3.copy(b)
        this._c = Vector3.copy(c)
        this.k = k
        this.subdivide(subdivide)
        this.boundary(boundary)
        this.regenerate();
    }
    public get a(): VectorE3 {
        return this._a
    }
    public set a(a: VectorE3) {
        this._a = a
        this._isModified = true
    }
    public get b(): VectorE3 {
        return this._b
    }
    public set b(b: VectorE3) {
        this._b = b
        this._isModified = true
    }
    public get c(): VectorE3 {
        return this._c
    }
    public set c(c: VectorE3) {
        this._c = c
        this._isModified = true
    }
    public isModified() {
        return this._isModified || super.isModified()
    }
    public setModified(modified: boolean): CuboidSimplexPrimitivesBuilder {
        this._isModified = modified
        super.setModified(modified)
        return this
    }
    public regenerate(): void {
        this.setModified(false)

        // Define the anchor points relative to the origin.
        var pos: Vector3[] = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return void 0 })
        pos[0] = new Vector3().sub(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[1] = new Vector3().add(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[2] = new Vector3().add(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[3] = new Vector3().sub(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[4] = new Vector3().copy(pos[3]).sub(this._c)
        pos[5] = new Vector3().copy(pos[2]).sub(this._c)
        pos[6] = new Vector3().copy(pos[1]).sub(this._c)
        pos[7] = new Vector3().copy(pos[0]).sub(this._c)

        // Perform the scale, tilt, offset active transformation.
        pos.forEach((point: Vector3) => {
            // point.scale(this.scale.x)
            // point.rotate(this.tilt)
            point.add(this.offset)
        })

        function simplex(indices: number[]): Simplex {
            let simplex = new Simplex(indices.length - 1)
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]]
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1([i])
            }
            return simplex
        }
        switch (this.k) {
            case 0: {
                var points = [[0], [1], [2], [3], [4], [5], [6], [7]]
                this.data = points.map(function (point) { return simplex(point) })
            }
                break
            case 1: {
                let lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]]
                this.data = lines.map(function (line) { return simplex(line) })
            }
                break
            case 2: {
                var faces: Simplex[][] = [0, 1, 2, 3, 4, 5].map(function (index) { return void 0 })
                faces[0] = quad(pos[0], pos[1], pos[2], pos[3])
                faces[1] = quad(pos[1], pos[6], pos[5], pos[2])
                faces[2] = quad(pos[7], pos[0], pos[3], pos[4])
                faces[3] = quad(pos[6], pos[7], pos[4], pos[5])
                faces[4] = quad(pos[3], pos[2], pos[5], pos[4])
                faces[5] = quad(pos[7], pos[6], pos[1], pos[0])
                this.data = faces.reduce(function (a, b) { return a.concat(b) }, []);

                this.data.forEach(function (simplex) {
                    computeFaceNormals(simplex);
                })
            }
                break
            default: {
                // Do nothing.
            }
        }
        // Compute the meta data.
        this.check()
    }
}

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

class CuboidPrimitivesBuilder extends PrimitivesBuilder {

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
        // FIXME: tilt should be computed.
        const t = Spinor3.one();
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

function boxPrimitive(options: BoxGeometryOptions = {}): Primitive {

    const k = isDefined(options.k) ? options.k : 2;
    switch (k) {
        case 0:
        case 1: {
            const a = DEFAULT_A;
            const b = DEFAULT_B;
            const c = DEFAULT_C;
            const builder = new CuboidSimplexPrimitivesBuilder(a, b, c, k);
            return reduce(builder.toPrimitives());
        }
        default: {
            const builder = new CuboidPrimitivesBuilder();
            builder.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
            builder.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
            builder.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1

            if (isDefined(options.openBack)) {
                builder.openBack = mustBeBoolean('openBack', options.openBack)
            }
            if (isDefined(options.openBase)) {
                builder.openBase = mustBeBoolean('openBase', options.openBase)
            }
            if (isDefined(options.openFront)) {
                builder.openFront = mustBeBoolean('openFront', options.openFront)
            }
            if (isDefined(options.openLeft)) {
                builder.openLeft = mustBeBoolean('openLeft', options.openLeft)
            }
            if (isDefined(options.openRight)) {
                builder.openRight = mustBeBoolean('openRight', options.openRight)
            }
            if (isDefined(options.openCap)) {
                builder.openCap = mustBeBoolean('openCap', options.openCap)
            }

            //    if (options.tilt) {
            //        builder.tilt.copySpinor(options.tilt)
            //    }
            if (options.offset) {
                builder.offset.copy(options.offset)
            }
            return reduce(builder.toPrimitives());
        }
    }
}

/**
 * A convenience class for creating a BoxGeometry.
 */
export default class BoxGeometry extends GeometryElements {
    private w = 1;
    private h = 1;
    private d = 1;

    constructor(contextManager: ContextManager, options: BoxGeometryOptions = {}, levelUp = 0) {
        super(boxPrimitive(options), contextManager, options, levelUp + 1)
        this.setLoggingName('BoxGeometry')
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    get width() {
        return this.w;
    }
    set width(value: number) {
        this.w = value;
        this.setScale(this.w, this.h, this.d);
    }

    get height() {
        return this.h;
    }
    set height(value: number) {
        this.h = value;
        this.setScale(this.w, this.h, this.d);
    }

    get depth() {
        return this.d;
    }
    set depth(value: number) {
        this.d = value;
        this.setScale(this.w, this.h, this.d);
    }

    /**
     *
     */
    getPrincipalScale(name: 'width' | 'height' | 'depth'): number {
        switch (name) {
            case 'width': {
                return this.width;
            }
            case 'height': {
                return this.height
            }
            case 'depth': {
                return this.depth
            }
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
    }

    /**
     *
     */
    setPrincipalScale(name: 'width' | 'depth' | 'height', value: number): void {
        switch (name) {
            case 'width': {
                this.width = value;
                break;
            }
            case 'height': {
                this.height = value;
                break;
            }
            case 'depth': {
                this.depth = value;
                break;
            }
            default: {
                throw new Error(notSupported(`setPrincipalScale('${name}')`).message)
            }
        }
    }
}
