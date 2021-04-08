import { GridTriangleStrip } from '../atoms/GridTriangleStrip';
import { reduce } from '../atoms/reduce';
import { isDefined } from '../checks/isDefined';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNumber } from '../checks/mustBeNumber';
import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Primitive } from '../core/Primitive';
import { computeFaceNormals } from '../geometries/computeFaceNormals';
import { quadrilateral as quad } from '../geometries/quadrilateral';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Geometric3 } from '../math/Geometric3';
import { vec, vectorCopy } from '../math/R3';
import { Spinor3 } from '../math/Spinor3';
import { SpinorE3 } from '../math/SpinorE3';
import { Vector1 } from '../math/Vector1';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { BoxGeometryOptions } from './BoxGeometryOptions';
import { GeometryMode } from './GeometryMode';
import { PrimitivesBuilder } from './PrimitivesBuilder';

/**
 * @hidden
 */
const canonicalAxis = vec(0, 1, 0);
/**
 * @hidden
 */
const canonicalMeridian = vec(0, 0, 1);

/**
 * e1
 * @hidden
 */
const DEFAULT_A = vec(1, 0, 0);
/**
 * e2
 * @hidden
 */
const DEFAULT_B = vec(0, 1, 0);
/**
 * e3
 * @hidden
 */
const DEFAULT_C = vec(0, 0, 1);

/**
 * @hidden
 */
class CuboidSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    private _a: VectorE3;
    private _b: VectorE3;
    private _c: VectorE3;
    private _isModified = true;
    constructor(a: VectorE3, b: VectorE3, c: VectorE3, k = SimplexMode.TRIANGLE, subdivide = 0, boundary = 0) {
        super();
        this._a = Vector3.copy(a);
        this._b = Vector3.copy(b);
        this._c = Vector3.copy(c);
        this.k = k;
        this.subdivide(subdivide);
        this.boundary(boundary);
        this.regenerate();
    }
    public get a(): VectorE3 {
        return this._a;
    }
    public set a(a: VectorE3) {
        this._a = a;
        this._isModified = true;
    }
    public get b(): VectorE3 {
        return this._b;
    }
    public set b(b: VectorE3) {
        this._b = b;
        this._isModified = true;
    }
    public get c(): VectorE3 {
        return this._c;
    }
    public set c(c: VectorE3) {
        this._c = c;
        this._isModified = true;
    }
    public isModified() {
        return this._isModified || super.isModified();
    }
    public setModified(modified: boolean): CuboidSimplexPrimitivesBuilder {
        this._isModified = modified;
        super.setModified(modified);
        return this;
    }
    public regenerate(): void {
        this.setModified(false);

        // Define the anchor points relative to the origin.
        const pos: Vector3[] = [0, 1, 2, 3, 4, 5, 6, 7].map(function () { return void 0; });
        pos[0] = new Vector3().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
        pos[1] = new Vector3().add(this._a).sub(this._b).add(this._c).divByScalar(2);
        pos[2] = new Vector3().add(this._a).add(this._b).add(this._c).divByScalar(2);
        pos[3] = new Vector3().sub(this._a).add(this._b).add(this._c).divByScalar(2);
        pos[4] = new Vector3().copy(pos[3]).sub(this._c);
        pos[5] = new Vector3().copy(pos[2]).sub(this._c);
        pos[6] = new Vector3().copy(pos[1]).sub(this._c);
        pos[7] = new Vector3().copy(pos[0]).sub(this._c);

        // Perform the scale, tilt, offset active transformation.
        pos.forEach((point: Vector3) => {
            // point.scale(this.scale.x)
            point.rotate(this.tilt);
            point.add(this.offset);
        });

        function simplex(indices: number[]): Simplex {
            const simplex = new Simplex(indices.length - 1);
            for (let i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]];
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1([i]);
            }
            return simplex;
        }
        switch (this.k) {
            case SimplexMode.POINT: {
                const points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                this.data = points.map(function (point) { return simplex(point); });
                break;
            }
            case SimplexMode.LINE: {
                const lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                this.data = lines.map(function (line) { return simplex(line); });
                break;
            }
            case SimplexMode.TRIANGLE: {
                const faces: Simplex[][] = [0, 1, 2, 3, 4, 5].map(function () { return void 0; });
                faces[0] = quad(pos[0], pos[1], pos[2], pos[3]);
                faces[1] = quad(pos[1], pos[6], pos[5], pos[2]);
                faces[2] = quad(pos[7], pos[0], pos[3], pos[4]);
                faces[3] = quad(pos[6], pos[7], pos[4], pos[5]);
                faces[4] = quad(pos[3], pos[2], pos[5], pos[4]);
                faces[5] = quad(pos[7], pos[6], pos[1], pos[0]);
                this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);

                this.data.forEach(function (simplex) {
                    computeFaceNormals(simplex);
                });
                break;
            }
            default: {
                // Do nothing.
            }
        }
        // Compute the meta data.
        this.check();
    }
}

/**
 * @hidden
 */
function side(tilt: SpinorE3, offset: Vector3, basis: Vector3[], uSegments: number, vSegments: number): GridTriangleStrip {

    // The normal will be the same for all vertices in the side, so we compute it once here.
    // Perform the stress ant tilt transformations on the tangent bivector before computing the normal.
    const tangent = Spinor3.wedge(basis[0], basis[1]).rotate(tilt);
    const normal = Vector3.dual(tangent).normalize();

    const aNeg = Vector3.copy(basis[0]).scale(-0.5);
    const aPos = Vector3.copy(basis[0]).scale(+0.5);
    const bNeg = Vector3.copy(basis[1]).scale(-0.5);
    const bPos = Vector3.copy(basis[1]).scale(+0.5);
    const cPos = Vector3.copy(basis[2]).scale(+0.5);
    const side = new GridTriangleStrip(uSegments, vSegments);
    for (let uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (let vIndex = 0; vIndex < side.vLength; vIndex++) {
            const u = uIndex / uSegments;
            const v = vIndex / vSegments;
            const a = Vector3.copy(aNeg).lerp(aPos, u);
            const b = Vector3.copy(bNeg).lerp(bPos, v);
            const vertex = side.vertex(uIndex, vIndex);

            const position = Vector3.copy(a).add(b).add(cPos);

            // Perform the stress, tilt, offset transformations (in that order)
            position.rotate(tilt);
            position.add(offset);

            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position;
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal;
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2([u, 1 - v]);
        }
    }
    return side;
}

/**
 * @hidden
 */
class CuboidPrimitivesBuilder extends PrimitivesBuilder {

    public iSegments = 1;
    public jSegments = 1;
    public kSegments = 1;

    public openBack = false;
    public openBase = false;
    public openFront = false;
    public openLeft = false;
    public openRight = false;
    public openCap = false;

    /**
     * The "width" direction. The default value is e1.
     */
    private _a: Vector3 = Vector3.vector(1, 0, 0);
    /**
     * The "height" direction. The default value is e2.
     */
    private _b: Vector3 = Vector3.vector(0, 1, 0);
    /**
     * The "depth" direction. The default value is e3.
     */
    private _c: Vector3 = Vector3.vector(0, 0, 1);

    private sides: GridTriangleStrip[];

    constructor() {
        super();
        this.sides = [];
    }

    get width() {
        return this._a.magnitude();
    }
    set width(width: number) {
        mustBeNumber('width', width);
        this._a.normalize().scale(width);
    }

    get height() {
        return this._b.magnitude();
    }
    set height(height: number) {
        mustBeNumber('height', height);
        this._b.normalize().scale(height);
    }

    get depth() {
        return this._c.magnitude();
    }
    set depth(depth: number) {
        mustBeNumber('depth', depth);
        this._c.normalize().scale(depth);
    }

    /**
     * Creates six TRIANGLE_STRIP faces using the GridTriangleStrip helper.
     */
    private regenerate(): void {
        this.sides = [];
        const t = this.tilt;
        const o = this.offset;
        if (!this.openFront) {
            this.sides.push(side(t, o, [this._a, this._b, this._c], this.iSegments, this.jSegments));
        }
        if (!this.openRight) {
            this.sides.push(side(t, o, [Vector3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
        }
        if (!this.openLeft) {
            this.sides.push(side(t, o, [this._c, this._b, Vector3.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
        }
        if (!this.openBack) {
            this.sides.push(side(t, o, [Vector3.copy(this._a).scale(-1), this._b, Vector3.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
        }
        if (!this.openCap) {
            this.sides.push(side(t, o, [this._a, Vector3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
        }
        if (!this.openBase) {
            this.sides.push(side(t, o, [this._a, this._c, Vector3.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        }
    }

    public toPrimitives(): Primitive[] {
        this.regenerate();
        return this.sides.map((side) => { return side.toPrimitive(); });
    }
}

/**
 * @hidden
 */
function boxPrimitive(options: BoxGeometryOptions = { kind: 'BoxGeometry' }): Primitive {

    const width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1;
    const height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1;
    const depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1;

    const axis = isDefined(options.axis) ? vectorCopy(options.axis).direction() : vec(0, 1, 0);
    const meridian = (isDefined(options.meridian) ? vectorCopy(options.meridian) : vec(0, 0, 1)).rejectionFrom(axis).direction();
    const tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [axis, meridian, axis.cross(meridian)]);

    const mode: GeometryMode = isDefined(options.mode) ? options.mode : GeometryMode.MESH;
    switch (mode) {
        case GeometryMode.POINT: {
            const a = DEFAULT_A.scale(width);
            const b = DEFAULT_B.scale(height);
            const c = DEFAULT_C.scale(depth);
            const builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode.POINT);
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            const primitives = builder.toPrimitives();
            if (primitives.length === 1) {
                return primitives[0];
            }
            else {
                throw new Error("Expecting CuboidSimplexPrimitivesBuilder to return one Primitive.");
            }
        }
        case GeometryMode.WIRE: {
            const a = DEFAULT_A.scale(width);
            const b = DEFAULT_B.scale(height);
            const c = DEFAULT_C.scale(depth);
            const builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode.LINE);
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            const primitives = builder.toPrimitives();
            if (primitives.length === 1) {
                return primitives[0];
            }
            else {
                throw new Error("Expecting CuboidSimplexPrimitivesBuilder to return one Primitive.");
            }
        }
        default: {
            const builder = new CuboidPrimitivesBuilder();
            builder.width = width;
            builder.height = height;
            builder.depth = depth;

            if (isDefined(options.openBack)) {
                builder.openBack = mustBeBoolean('openBack', options.openBack);
            }
            if (isDefined(options.openBase)) {
                builder.openBase = mustBeBoolean('openBase', options.openBase);
            }
            if (isDefined(options.openFront)) {
                builder.openFront = mustBeBoolean('openFront', options.openFront);
            }
            if (isDefined(options.openLeft)) {
                builder.openLeft = mustBeBoolean('openLeft', options.openLeft);
            }
            if (isDefined(options.openRight)) {
                builder.openRight = mustBeBoolean('openRight', options.openRight);
            }
            if (isDefined(options.openCap)) {
                builder.openCap = mustBeBoolean('openCap', options.openCap);
            }
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            return reduce(builder.toPrimitives());
        }
    }
}

/**
 * A convenience class for creating a BoxGeometry.
 * @hidden
 */
export class BoxGeometry extends GeometryElements {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: BoxGeometryOptions = { kind: 'BoxGeometry' }, levelUp = 0) {
        super(contextManager, boxPrimitive(options), options, levelUp + 1);
        this.setLoggingName('BoxGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('BoxGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
