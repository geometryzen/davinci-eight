import { isDefined } from '../checks/isDefined';
import { isNumber } from '../checks/isNumber';
import { isObject } from '../checks/isObject';
import { mustBeEQ } from '../checks/mustBeEQ';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { lock, TargetLockedError } from '../core/Lockable';
import { b2 } from '../geometries/b2';
import { b3 } from '../geometries/b3';
import { notImplemented } from '../i18n/notImplemented';
import { notSupported } from '../i18n/notSupported';
import { approx } from './approx';
import { arraysEQ } from './arraysEQ';
import { dotVectorE2 as dotVector } from './dotVectorE2';
import { extE2 } from './extE2';
import { gauss } from './gauss';
import { GeometricE2 } from './GeometricE2';
import { lcoE2 } from './lcoE2';
import { mulE2 } from './mulE2';
import { Pseudo } from './Pseudo';
import { rcoE2 } from './rcoE2';
import { rotorFromDirectionsE2 } from './rotorFromDirectionsE2';
import { scpE2 } from './scpE2';
import { SpinorE2 } from './SpinorE2';
import { stringFromCoordinates } from './stringFromCoordinates';
import { VectorE2 } from './VectorE2';
import { wedgeXY } from './wedgeXY';

// symbolic constants for the coordinate indices into the data array.
/**
 * @hidden
 */
const COORD_SCALAR = 0;
/**
 * @hidden
 */
const COORD_X = 1;
/**
 * @hidden
 */
const COORD_Y = 2;
/**
 * @hidden
 */
const COORD_PSEUDO = 3;

/**
 * @hidden
 */
const abs = Math.abs;
/**
 * @hidden
 */
const atan2 = Math.atan2;
/**
 * @hidden
 */
const exp = Math.exp;
/**
 * @hidden
 */
const log = Math.log;
/**
 * @hidden
 */
const cos = Math.cos;
/**
 * @hidden
 */
const sin = Math.sin;
/**
 * @hidden
 */
const sqrt = Math.sqrt;

/**
 * @hidden
 */
const LEFTWARDS_ARROW = "←";
/**
 * @hidden
 */
const RIGHTWARDS_ARROW = "→";
/**
 * @hidden
 */
const UPWARDS_ARROW = "↑";
/**
 * @hidden
 */
const DOWNWARDS_ARROW = "↓";
/**
 * @hidden
 */
const CLOCKWISE_OPEN_CIRCLE_ARROW = "↻";
/**
 * @hidden
 */
const ANTICLOCKWISE_OPEN_CIRCLE_ARROW = "↺";

/**
 * @hidden
 */
const ARROW_LABELS = ["1", [LEFTWARDS_ARROW, RIGHTWARDS_ARROW], [DOWNWARDS_ARROW, UPWARDS_ARROW], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
/**
 * @hidden
 */
const COMPASS_LABELS = ["1", ['W', 'E'], ['S', 'N'], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
/**
 * @hidden
 */
const STANDARD_LABELS = ["1", "e1", "e2", "I"];

/**
 * @hidden
 */
const zero = function zero(): [number, number, number, number] {
    return [0, 0, 0, 0];
};

/**
 * @hidden
 */
const scalar = function scalar(a: number) {
    const coords = zero();
    coords[COORD_SCALAR] = a;
    return coords;
};

/**
 * @hidden
 */
const vector = function vector(x: number, y: number) {
    const coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    return coords;
};

/**
 * @hidden
 */
const pseudo = function pseudo(b: number) {
    const coords = zero();
    coords[COORD_PSEUDO] = b;
    return coords;
};

/**
 * Coordinates corresponding to basis labels.
 * @hidden
 */
function coordinates(m: GeometricE2) {
    const coords = zero();
    coords[COORD_SCALAR] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_PSEUDO] = m.b;
    return coords;
}

/**
 * Promotes an unknown value to a Geometric2, or returns undefined.
 * @hidden
 */
function duckCopy(value: any): Geometric2 {
    if (isObject(value)) {
        const m = <GeometricE2>value;
        if (isNumber(m.x) && isNumber(m.y)) {
            if (isNumber(m.a) && isNumber(m.b)) {
                console.warn("Copying GeometricE2 to Geometric2");
                return Geometric2.copy(m);
            }
            else {
                console.warn("Copying VectorE2 to Geometric2");
                return Geometric2.fromVector(m);
            }
        }
        else {
            if (isNumber(m.a) && isNumber(m.b)) {
                console.warn("Copying SpinorE2 to Geometric2");
                return Geometric2.fromSpinor(m);
            }
            else {
                return void 0;
            }
        }
    }
    else {
        return void 0;
    }
}

/**
 * @hidden
 */
export class Geometric2 {
    // Lockable
    public isLocked(): boolean {
        return typeof (this as any)['lock_'] === 'number';
    }

    public lock(): number {
        if (this.isLocked()) {
            throw new Error("already locked");
        }
        else {
            (this as any)['lock_'] = Math.random();
            return (this as any)['lock_'];
        }
    }

    public unlock(token: number): void {
        if (typeof token !== 'number') {
            throw new Error("token must be a number.");
        }
        if (!this.isLocked()) {
            throw new Error("not locked");
        }
        else if ((this as any)['lock_'] === token) {
            (this as any)['lock_'] = void 0;
        }
        else {
            throw new Error("unlock denied");
        }
    }

    /**
     * 
     */
    private coords_: number[];

    /**
     * 
     */
    private modified_: boolean;

    /**
     *
     */
    static readonly BASIS_LABELS = STANDARD_LABELS;

    /**
     *
     */
    static readonly BASIS_LABELS_COMPASS = COMPASS_LABELS;

    /**
     *
     */
    static readonly BASIS_LABELS_GEOMETRIC = ARROW_LABELS;

    /**
     *
     */
    static readonly BASIS_LABELS_STANDARD = STANDARD_LABELS;

    /**
     * [scalar, x, y, pseudo]
     */
    constructor(coords: [number, number, number, number] = [0, 0, 0, 0], modified = false) {
        mustBeEQ('coords.length', coords.length, 4);
        this.coords_ = coords;
        this.modified_ = modified;
    }

    get length(): number {
        return 4;
    }

    get modified(): boolean {
        return this.modified_;
    }
    set modified(modified: boolean) {
        if (this.isLocked()) {
            throw new TargetLockedError('set modified');
        }
        this.modified_ = modified;
    }

    getComponent(i: number): number {
        return this.coords_[i];
    }

    get a(): number {
        return this.coords_[COORD_SCALAR];
    }
    set a(a: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set a');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_SCALAR] !== a;
        coords[COORD_SCALAR] = a;
    }

    get x(): number {
        return this.coords_[COORD_X];
    }
    set x(x: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set x');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_X] !== x;
        coords[COORD_X] = x;
    }

    get y(): number {
        return this.coords_[COORD_Y];
    }
    set y(y: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set y');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_Y] !== y;
        coords[COORD_Y] = y;
    }

    get b(): number {
        return this.coords_[COORD_PSEUDO];
    }
    set b(b: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set b');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_PSEUDO] !== b;
        coords[COORD_PSEUDO] = b;
    }

    /**
     *
     */
    /*
    private get xy(): number {
        return this.coords_[COORD_PSEUDO];
    }
    private set xy(xy: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set xy');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_PSEUDO] !== xy;
        coords[COORD_PSEUDO] = xy;
    }
    */

    /**
     * this ⟼ this + M * α
     */
    add(M: GeometricE2, α = 1): this {
        mustBeObject('M', M);
        mustBeNumber('α', α);
        this.a += M.a * α;
        this.x += M.x * α;
        this.y += M.y * α;
        this.b += M.b * α;
        return this;
    }

    /**
     * this ⟼ a + b
     */
    add2(a: GeometricE2, b: GeometricE2): this {
        mustBeObject('a', a);
        mustBeObject('b', b);
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.b = a.b + b.b;
        return this;
    }

    /**
     * this ⟼ this + Iβ
     */
    addPseudo(β: number): this {
        mustBeNumber('β', β);
        this.b += β;
        return this;
    }

    /**
     * this ⟼ this + α
     */
    addScalar(α: number): this {
        mustBeNumber('α', α);
        this.a += α;
        return this;
    }

    /**
     * this ⟼ this + v * α
     */
    addVector(v: VectorE2, α = 1): this {
        mustBeObject('v', v);
        mustBeNumber('α', α);
        this.x += v.x * α;
        this.y += v.y * α;
        return this;
    }

    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns The arg of <code>this</code> multivector.
     */
    arg(): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().arg());
        }
        else {
            return this.log().grade(2);
        }
    }

    /**
     *
     */
    approx(n: number): this {
        approx(this.coords_, n);
        return this;
    }

    /**
     * copy(this)
     */
    clone(): Geometric2 {
        const m = new Geometric2([0, 0, 0, 0]);
        m.copy(this);
        return m;
    }

    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     * 
     * @returns conj(this)
     */
    conj(): this {
        // FIXME: This is only the bivector part.
        // Also need to think about various involutions.
        this.b = -this.b;
        return this;
    }

    /**
     *
     */
    cos(): this {
        throw new Error(notImplemented('cos').message);
    }

    /**
     *
     */
    cosh(): this {
        throw new Error(notImplemented('cosh').message);
    }

    /**
     *
     */
    distanceTo(M: GeometricE2): number {
        const α = this.a - M.a;
        const x = this.x - M.x;
        const y = this.y - M.y;
        const β = this.b - M.b;
        return Math.sqrt(scpE2(α, x, y, β, α, x, y, β, 0));
    }

    /**
     * this ⟼ copy(M)
     */
    copy(M: GeometricE2): this {
        mustBeObject('M', M);
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.b = M.b;
        return this;
    }

    /**
     * Sets this multivector to the value of the scalar, α.
     */
    copyScalar(α: number): this {
        return this.zero().addScalar(α);
    }

    /**
     * this ⟼ copy(spinor)
     */
    copySpinor(spinor: SpinorE2): this {
        mustBeObject('spinor', spinor);
        this.a = spinor.a;
        this.x = 0;
        this.y = 0;
        this.b = spinor.b;
        return this;
    }

    /**
     * this ⟼ copyVector(vector)
     */
    copyVector(vector: VectorE2): this {
        mustBeObject('vector', vector);
        this.a = 0;
        this.x = vector.x;
        this.y = vector.y;
        this.b = 0;
        return this;
    }

    /**
     *
     */
    cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2): this {
        const α = b3(t, this.a, controlBegin.a, controlEnd.a, endPoint.a);
        const x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        const y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        const β = b3(t, this.b, controlBegin.b, controlEnd.b, endPoint.b);
        this.a = α;
        this.x = x;
        this.y = y;
        this.b = β;
        return this;
    }

    /**
     * this ⟼ this / magnitude(this)
     */
    normalize(): this {
        if (this.isLocked()) {
            throw new TargetLockedError('normalize');
        }
        const norm: number = this.magnitude();
        this.a = this.a / norm;
        this.x = this.x / norm;
        this.y = this.y / norm;
        this.b = this.b / norm;
        return this;
    }

    /**
     * this ⟼ this / m
     */
    div(m: GeometricE2): this {
        return this.div2(this, m);
    }

    /**
     * this ⟼ a / b
     */
    div2(a: GeometricE2, b: GeometricE2): this {
        // Invert b using this then multiply, being careful to account for the case
        // when a and this are the same instance by getting a's coordinates first.
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        this.copy(b).inv();
        const b0 = this.a;
        const b1 = this.x;
        const b2 = this.y;
        const b3 = this.b;
        this.a = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * this ⟼ this / α
     */
    divByScalar(α: number): this {
        mustBeNumber('α', α);
        this.a /= α;
        this.x /= α;
        this.y /= α;
        this.b /= α;
        return this;
    }

    /**
     *
     */
    dual(): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().dual());
        }
        else {
            const a = this.b;
            const y = -this.x;
            const x = this.y;
            const b = -this.a;

            this.a = a;
            this.x = x;
            this.y = y;
            this.b = b;
            return this;
        }
    }

    /**
     *
     */
    equals(other: any): boolean {
        if (other instanceof Geometric2) {
            const that: Geometric2 = other;
            return arraysEQ(this.coords_, that.coords_);
        }
        else {
            return false;
        }
    }

    /**
     * this ⟼ exp(this)
     */
    exp(): this {
        const w = this.a;
        const z = this.b;
        const expW = exp(w);
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        const φ = sqrt(z * z);
        const s = expW * (φ !== 0 ? sin(φ) / φ : 1);
        this.a = expW * cos(φ);
        this.b = z * s;
        return this;
    }

    /**
     * this ⟼ this ^ m
     */
    ext(m: GeometricE2): this {
        return this.ext2(this, m);
    }

    /**
     * this ⟼ a ^ b
     */
    ext2(a: GeometricE2, b: GeometricE2): this {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * Sets this multivector to its inverse, if it exists.
     */
    inv(): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().inv());
        } else {
            // We convert the mutivector/geometric product into a tensor
            // representation with the consequence that inverting the multivector
            // is equivalent to solving a matrix equation, AX = b for X.
            const α = this.a;
            const x = this.x;
            const y = this.y;
            const β = this.b;

            const A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];

            const b = [1, 0, 0, 0];

            const X = gauss(A, b);

            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.b = X[3];

            return this;
        }
    }

    /**
     * 
     */
    isOne(): boolean {
        return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
    }

    /**
     * 
     */
    isZero(): boolean {
        return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
    }

    /**
     * this ⟼ this << m
     */
    lco(m: GeometricE2): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().lco(m));
        } else {
            return this.lco2(this, m);
        }
    }

    /**
     * this ⟼ a << b
     */
    lco2(a: GeometricE2, b: GeometricE2): this {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * this ⟼ this + α * (target - this)
     */
    lerp(target: GeometricE2, α: number): this {
        mustBeObject('target', target);
        mustBeNumber('α', α);
        this.a += (target.a - this.a) * α;
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.b += (target.b - this.b) * α;
        return this;
    }

    /**
     * this ⟼ a + α * (b - a)
     */
    lerp2(a: GeometricE2, b: GeometricE2, α: number): this {
        mustBeObject('a', a);
        mustBeObject('b', b);
        mustBeNumber('α', α);
        this.copy(a).lerp(b, α);
        return this;
    }

    /**
     * this ⟼ log(sqrt(α * α + β * β)) + e1e2 * atan2(β, α),
     * where α is the scalar part of `this`,
     * and β is the pseudoscalar part of `this`.
     */
    log(): this {
        // FIXME: This only handles the spinor components.
        const α = this.a;
        const β = this.b;
        this.a = log(sqrt(α * α + β * β));
        this.x = 0;
        this.y = 0;
        this.b = atan2(β, α);
        return this;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * This method does not change this multivector.
     */
    magnitude(): number {
        return sqrt(this.quaditude());
    }

    /**
     * this ⟼ this * m
     */
    mul(m: GeometricE2): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().mul(m));
        } else {
            return this.mul2(this, m);
        }
    }

    /**
     * this ⟼ a * b
     */
    mul2(a: GeometricE2, b: GeometricE2): this {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * this ⟼ -1 * this
     */
    neg(): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().neg());
        } else {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.b = -this.b;
            return this;
        }
    }

    /**
     * this ⟼ sqrt(this * conj(this))
     */
    norm(): this {
        this.a = this.magnitude();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     */
    one(): this {
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     *
     */
    pow(M: GeometricE2): this {
        mustBeObject('M', M);
        throw new Error(notImplemented('pow').message);
    }

    /**
     * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
     *
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    quad(): this {
        this.a = this.quaditude();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     *
     */
    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2): this {
        const α = b2(t, this.a, controlPoint.a, endPoint.a);
        const x = b2(t, this.x, controlPoint.x, endPoint.x);
        const y = b2(t, this.y, controlPoint.y, endPoint.y);
        const β = b2(t, this.b, controlPoint.b, endPoint.b);
        this.a = α;
        this.x = x;
        this.y = y;
        this.b = β;
        return this;
    }

    /**
     * this ⟼ this >> m
     */
    rco(m: GeometricE2): this {
        return this.rco2(this, m);
    }

    /**
     * this ⟼ a >> b
     */
    rco2(a: GeometricE2, b: GeometricE2): this {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;
        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;
        this.a = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
        this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
        this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
        this.b = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
        return this;
    }

    /**
     * this ⟼ - n * this * n
     */
    reflect(n: VectorE2): this {
        mustBeObject('n', n);

        const nx = n.x;
        const ny = n.y;
        mustBeNumber('n.x', nx);
        mustBeNumber('n.y', ny);
        const x = this.x;
        const y = this.y;

        const μ = nx * nx - ny * ny;
        const λ = -2 * nx * ny;

        this.a = -this.a;
        this.x = λ * y - μ * x;
        this.y = λ * x + μ * y;
        this.b = +this.b;

        return this;
    }

    /**
     * this ⟼ rev(this)
     */
    rev(): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().rev());
        } else {
            // reverse has a ++-- structure.
            // this.a = this.a;
            // this.x = this.x;
            // this.y = this.y;
            this.b = -this.b;
            return this;
        }
    }

    /**
     *
     */
    sin(): this {
        throw new Error(notImplemented('sin').message);
    }

    /**
     *
     */
    sinh(): this {
        throw new Error(notImplemented('sinh').message);
    }

    /**
     * this ⟼ R * this * rev(R)
     */
    rotate(R: SpinorE2): this {
        mustBeObject('R', R);

        const x = this.x;
        const y = this.y;

        const β = R.b;
        const α = R.a;

        const ix = α * x + β * y;
        const iy = α * y - β * x;

        this.x = ix * α + iy * β;
        this.y = iy * α - ix * β;

        return this;
    }

    /**
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): this {
        rotorFromDirectionsE2(a, b, this);
        return this;
    }

    rotorFromVectorToVector(a: VectorE2, b: VectorE2): this {
        rotorFromDirectionsE2(a, b, this);
        return this;
    }

    /**
     * this ⟼ exp(- B * θ / 2)
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): this {
        mustBeObject('B', B);
        mustBeNumber('θ', θ);
        // We assume that B really is just a bivector
        // by ignoring scalar and vector components.
        // Normally, B will have unit magnitude and B * B => -1.
        // However, we don't assume that is the case.
        // The effect will be a scaling of the angle.
        // A non unitary rotor, on the other hand, will scale the transformation.
        // We must also take into account the orientation of B.
        const β = B.b;
        /**
         * Sandwich operation means we need the half-angle.
         */
        const φ = θ / 2;
        /**
         * scalar part = cos(|B| * θ / 2)
         */
        this.a = cos(abs(β) * φ);
        this.x = 0;
        this.y = 0;
        /**
         * pseudo part = -unit(B) * sin(|B| * θ / 2)
         */
        this.b = -sin(β * φ);
        return this;
    }

    /**
     * this ⟼ scp(this, m)
     */
    scp(m: GeometricE2): this {
        return this.scp2(this, m);
    }

    /**
     * this ⟼ scp(a, b)
     */
    scp2(a: GeometricE2, b: GeometricE2): this {
        this.a = scpE2(a.a, a.x, a.y, a.b, b.a, b.x, b.y, b.b, 0);
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * this ⟼ this * α
     */
    scale(α: number): this {
        mustBeNumber('α', α);
        this.a *= α;
        this.x *= α;
        this.y *= α;
        this.b *= α;
        return this;
    }

    /**
     *
     */
    stress(σ: VectorE2): this {
        mustBeObject('σ', σ);
        throw new Error(notSupported('stress').message);
    }

    /**
     * this ⟼ a * b = a · b + a ^ b
     *
     * Sets this Geometric2 to the geometric product, a * b, of the vector arguments.
     */
    versor(a: VectorE2, b: VectorE2): this {
        const ax = a.x;
        const ay = a.y;
        const bx = b.x;
        const by = b.y;

        this.a = dotVector(a, b);
        this.x = 0;
        this.y = 0;
        this.b = wedgeXY(ax, ay, 0, bx, by, 0);

        return this;
    }

    /**
     * this ⟼ this * ~this
     */
    squaredNorm(): this {
        this.a = this.magnitude();
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * @returns the square of the <code>magnitude</code> of <code>this</code>.  
     */
    quaditude(): number {
        const a = this.a;
        const x = this.x;
        const y = this.y;
        const b = this.b;
        return a * a + x * x + y * y + b * b;
    }

    /**
     * this ⟼ this - M * α
     */
    sub(M: GeometricE2, α = 1): this {
        mustBeObject('M', M);
        mustBeNumber('α', α);
        this.a -= M.a * α;
        this.x -= M.x * α;
        this.y -= M.y * α;
        this.b -= M.b * α;
        return this;
    }

    /**
     * this ⟼ a - b
     */
    sub2(a: GeometricE2, b: GeometricE2): this {
        mustBeObject('a', a);
        mustBeObject('b', b);
        this.a = a.a - b.a;
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.b = a.b - b.b;
        return this;
    }

    /**
     * 
     */
    toArray(): number[] {
        return coordinates(this);
    }

    /**
     * Returns a representation of this multivector in exponential notation.
     */
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * Returns a representation of this multivector in fixed-point notation.
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * Returns a representation of this multivector in exponential or fixed-point notation.
     */
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * Returns a representation of this multivector.
     */
    toString(radix?: number): string {
        const coordToString = function (coord: number): string { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, Geometric2.BASIS_LABELS);
    }

    /**
     * Extraction of grade <em>i</em>.
     *
     * If this multivector is mutable (unlocked) then it is set to the result.
     *
     * @param i The index of the grade to be extracted.
     */
    grade(i: number): Geometric2 {
        if (this.isLocked()) {
            return lock(this.clone().grade(i));
        }
        mustBeInteger('i', i);
        switch (i) {
            case 0: {
                this.x = 0;
                this.y = 0;
                this.b = 0;
                break;
            }
            case 1: {
                this.a = 0;
                this.b = 0;
                break;
            }
            case 2: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                break;
            }
            default: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.b = 0;
            }
        }
        return this;
    }

    /**
     * Sets this multivector to the identity element for addition, 0.
     * 
     * this ⟼ 0
     */
    zero(): this {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        return this;
    }

    /**
     * Implements this + rhs as addition.
     * The returned value is locked.
     */
    __add__(rhs: any): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).add(rhs));
        }
        else if (typeof rhs === 'number') {
            // Addition commutes, but addScalar might be useful.
            return lock(Geometric2.scalar(rhs).add(this));
        }
        else {
            const rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
                // rhs is a copy and addition commutes.
                return lock(rhsCopy.add(this));
            }
            else {
                return void 0;
            }
        }
    }

    /**
     *
     */
    __div__(rhs: any): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).div(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).divByScalar(rhs));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __rdiv__(lhs: any): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).div(this));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __mul__(rhs: any): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).mul(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).scale(rhs));
        }
        else {
            const rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
                // rhsCopy is a copy but multiplication does not commute.
                // If we had rmul then we could mutate the rhs!
                return this.__mul__(rhsCopy);
            }
            else {
                return void 0;
            }
        }
    }

    /**
     *
     */
    __rmul__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.copy(this).scale(lhs));
        }
        else {
            const lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it, and use it on the left.
                return lock(lhsCopy.mul(this));
            }
            else {
                return void 0;
            }
        }
    }

    /**
     *
     */
    __radd__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).add(this));
        }
        else {
            const lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
                // lhs is a copy, so we can mutate it.
                return lock(lhsCopy.add(this));
            }
            else {
                return void 0;
            }
        }
    }

    /**
     *
     */
    __sub__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).sub(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.scalar(-rhs).add(this));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __rsub__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __wedge__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication.
            return lock(Geometric2.copy(this).scale(rhs));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __rwedge__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is simply scalar multiplication, and commutes.
            return lock(Geometric2.copy(this).scale(lhs));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __lshift__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).lco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __rlshift__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __rshift__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).rco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __rrshift__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __vbar__(rhs: any) {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).scp(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __rvbar__(lhs: any) {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    __bang__(): Geometric2 {
        return lock(Geometric2.copy(this).inv());
    }

    /**
     *
     */
    __tilde__(): Geometric2 {
        return lock(Geometric2.copy(this).rev());
    }

    /**
     *
     */
    __pos__(): Geometric2 {
        // It's important that we make a copy whenever using operators.
        return lock(Geometric2.copy(this));
    }

    /**
     *
     */
    __neg__(): Geometric2 {
        return lock(Geometric2.copy(this).neg());
    }

    /**
     *
     */
    static copy(M: GeometricE2): Geometric2 {
        return new Geometric2([M.a, M.x, M.y, M.b]);
    }

    /**
     * The basis element corresponding to the vector `x` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly E1 = new Geometric2(vector(1, 0));

    /**
     * Constructs the basis vector e1.
     * Locking the vector prevents mutation. 
     */
    public static e1(lock = false): Geometric2 {
        return lock ? Geometric2.E1 : Geometric2.vector(1, 0);
    }

    /**
     * The basis element corresponding to the vector `y` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly E2 = new Geometric2(vector(0, 1));

    /**
     * Constructs the basis vector e2.
     * Locking the vector prevents mutation. 
     */
    public static e2(lock = false): Geometric2 {
        return lock ? Geometric2.E2 : Geometric2.vector(0, 1);
    }

    /**
     *
     */
    static fromCartesian(a: number, x: number, y: number, b: number): Geometric2 {
        return new Geometric2([a, x, y, b]);
    }

    static fromBivector(B: Pseudo): Geometric2 {
        return Geometric2.fromCartesian(0, 0, 0, B.b);
    }

    /**
     *
     */
    static fromSpinor(spinor: SpinorE2): Geometric2 {
        return new Geometric2([spinor.a, 0, 0, spinor.b]);
    }

    /**
     *
     */
    static fromVector(v: VectorE2): Geometric2 {
        if (isDefined(v)) {
            return new Geometric2([0, v.x, v.y, 0]);
        }
        else {
            // We could also return an undefined value here!
            return void 0;
        }
    }

    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    public static readonly PSEUDO = new Geometric2(pseudo(1));

    /**
     *
     */
    public static I(lock = false): Geometric2 {
        return lock ? Geometric2.PSEUDO : Geometric2.pseudo(1);
    }

    /**
     * A + α * (B - A)
     */
    static lerp(A: GeometricE2, B: GeometricE2, α: number): Geometric2 {
        return Geometric2.copy(A).lerp(B, α);
        // return Geometric2.copy(B).sub(A).scale(α).add(A)
    }

    /**
     * The identity element for multiplication, `1`.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly ONE = new Geometric2(scalar(1));

    /**
     * 
     */
    public static one(lock = false): Geometric2 {
        return lock ? Geometric2.ONE : Geometric2.scalar(1);
    }

    /**
     * Computes the rotor that rotates vector a to vector b.
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2 {
        return new Geometric2().rotorFromDirections(a, b);
    }

    /**
     *
     */
    static pseudo(β: number): Geometric2 {
        return Geometric2.fromCartesian(0, 0, 0, β);
    }

    /**
     *
     */
    static scalar(α: number): Geometric2 {
        return Geometric2.fromCartesian(α, 0, 0, 0);
    }

    /**
     *
     */
    static vector(x: number, y: number): Geometric2 {
        return Geometric2.fromCartesian(0, x, y, 0);
    }

    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    public static readonly ZERO = new Geometric2(scalar(0));

    /**
     * 
     */
    public static zero(lock = false): Geometric2 {
        return lock ? Geometric2.ZERO : new Geometric2(zero());
    }
}
Geometric2.E1.lock();
Geometric2.E2.lock();
Geometric2.ONE.lock();
Geometric2.PSEUDO.lock();
Geometric2.ZERO.lock();
