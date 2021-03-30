import { VectorN } from '../atoms/VectorN';
import { LockableMixin } from '../core/Lockable';
import { GeometricE2 } from './GeometricE2';
import { Pseudo } from './Pseudo';
import { SpinorE2 } from './SpinorE2';
import { VectorE2 } from './VectorE2';
/**
 *
 */
export declare class Geometric2 implements GeometricE2, LockableMixin, VectorN<number> {
    isLocked: () => boolean;
    lock: () => number;
    unlock: (token: number) => void;
    /**
     *
     */
    private coords_;
    /**
     *
     */
    private modified_;
    /**
     *
     */
    static readonly BASIS_LABELS: string[];
    /**
     *
     */
    static readonly BASIS_LABELS_COMPASS: (string | string[])[];
    /**
     *
     */
    static readonly BASIS_LABELS_GEOMETRIC: (string | string[])[];
    /**
     *
     */
    static readonly BASIS_LABELS_STANDARD: string[];
    /**
     * [scalar, x, y, pseudo]
     */
    constructor(coords?: [number, number, number, number], modified?: boolean);
    get length(): number;
    get modified(): boolean;
    set modified(modified: boolean);
    getComponent(i: number): number;
    get a(): number;
    set a(a: number);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get b(): number;
    set b(b: number);
    /**
     *
     */
    /**
     * this ⟼ this + M * α
     */
    add(M: GeometricE2, α?: number): this;
    /**
     * this ⟼ a + b
     */
    add2(a: GeometricE2, b: GeometricE2): this;
    /**
     * this ⟼ this + Iβ
     */
    addPseudo(β: number): this;
    /**
     * this ⟼ this + α
     */
    addScalar(α: number): this;
    /**
     * this ⟼ this + v * α
     */
    addVector(v: VectorE2, α?: number): this;
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns The arg of <code>this</code> multivector.
     */
    arg(): Geometric2;
    /**
     *
     */
    approx(n: number): this;
    /**
     * copy(this)
     */
    clone(): Geometric2;
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    conj(): this;
    /**
     *
     */
    cos(): this;
    /**
     *
     */
    cosh(): this;
    /**
     *
     */
    distanceTo(M: GeometricE2): number;
    /**
     * this ⟼ copy(M)
     */
    copy(M: GeometricE2): this;
    /**
     * Sets this multivector to the value of the scalar, α.
     */
    copyScalar(α: number): this;
    /**
     * this ⟼ copy(spinor)
     */
    copySpinor(spinor: SpinorE2): this;
    /**
     * this ⟼ copyVector(vector)
     */
    copyVector(vector: VectorE2): this;
    /**
     *
     */
    cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2): this;
    /**
     * this ⟼ this / magnitude(this)
     */
    normalize(): this;
    /**
     * this ⟼ this / m
     */
    div(m: GeometricE2): this;
    /**
     * this ⟼ a / b
     */
    div2(a: GeometricE2, b: GeometricE2): this;
    /**
     * this ⟼ this / α
     */
    divByScalar(α: number): this;
    /**
     * this ⟼ dual(m) = I * m
     */
    dual(m: GeometricE2): this;
    /**
     *
     */
    equals(other: any): boolean;
    /**
     * this ⟼ exp(this)
     */
    exp(): this;
    /**
     * this ⟼ this ^ m
     */
    ext(m: GeometricE2): this;
    /**
     * this ⟼ a ^ b
     */
    ext2(a: GeometricE2, b: GeometricE2): this;
    /**
     * Sets this multivector to its inverse, if it exists.
     */
    inv(): this;
    /**
     *
     */
    isOne(): boolean;
    /**
     *
     */
    isZero(): boolean;
    /**
     * this ⟼ this << m
     */
    lco(m: GeometricE2): this;
    /**
     * this ⟼ a << b
     */
    lco2(a: GeometricE2, b: GeometricE2): this;
    /**
     * this ⟼ this + α * (target - this)
     */
    lerp(target: GeometricE2, α: number): this;
    /**
     * this ⟼ a + α * (b - a)
     */
    lerp2(a: GeometricE2, b: GeometricE2, α: number): this;
    /**
     * this ⟼ log(sqrt(α * α + β * β)) + e1e2 * atan2(β, α),
     * where α is the scalar part of `this`,
     * and β is the pseudoscalar part of `this`.
     */
    log(): this;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * This method does not change this multivector.
     */
    magnitude(): number;
    /**
     * this ⟼ this * m
     */
    mul(m: GeometricE2): this;
    /**
     * this ⟼ a * b
     */
    mul2(a: GeometricE2, b: GeometricE2): this;
    /**
     * this ⟼ -1 * this
     */
    neg(): this;
    /**
     * this ⟼ sqrt(this * conj(this))
     */
    norm(): this;
    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     */
    one(): this;
    /**
     *
     */
    pow(M: GeometricE2): this;
    /**
     * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
     *
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    quad(): this;
    /**
     *
     */
    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2): this;
    /**
     * this ⟼ this >> m
     */
    rco(m: GeometricE2): this;
    /**
     * this ⟼ a >> b
     */
    rco2(a: GeometricE2, b: GeometricE2): this;
    /**
     * this ⟼ - n * this * n
     */
    reflect(n: VectorE2): this;
    /**
     * this ⟼ rev(this)
     */
    rev(): this;
    /**
     *
     */
    sin(): this;
    /**
     *
     */
    sinh(): this;
    /**
     * this ⟼ R * this * rev(R)
     */
    rotate(R: SpinorE2): this;
    /**
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): this;
    rotorFromVectorToVector(a: VectorE2, b: VectorE2): this;
    /**
     * this ⟼ exp(- B * θ / 2)
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): this;
    /**
     * this ⟼ scp(this, m)
     */
    scp(m: GeometricE2): this;
    /**
     * this ⟼ scp(a, b)
     */
    scp2(a: GeometricE2, b: GeometricE2): this;
    /**
     * this ⟼ this * α
     */
    scale(α: number): this;
    /**
     *
     */
    stress(σ: VectorE2): this;
    /**
     * this ⟼ a * b = a · b + a ^ b
     *
     * Sets this Geometric2 to the geometric product, a * b, of the vector arguments.
     */
    versor(a: VectorE2, b: VectorE2): this;
    /**
     * this ⟼ this * ~this
     */
    squaredNorm(): this;
    /**
     * @returns the square of the <code>magnitude</code> of <code>this</code>.
     */
    quaditude(): number;
    /**
     * this ⟼ this - M * α
     */
    sub(M: GeometricE2, α?: number): this;
    /**
     * this ⟼ a - b
     */
    sub2(a: GeometricE2, b: GeometricE2): this;
    /**
     *
     */
    toArray(): number[];
    /**
     * Returns a representation of this multivector in exponential notation.
     */
    toExponential(fractionDigits?: number): string;
    /**
     * Returns a representation of this multivector in fixed-point notation.
     */
    toFixed(fractionDigits?: number): string;
    /**
     * Returns a representation of this multivector in exponential or fixed-point notation.
     */
    toPrecision(precision?: number): string;
    /**
     * Returns a representation of this multivector.
     */
    toString(radix?: number): string;
    /**
     * Extraction of grade <em>i</em>.
     *
     * If this multivector is mutable (unlocked) then it is set to the result.
     *
     * @param i The index of the grade to be extracted.
     */
    grade(i: number): Geometric2;
    /**
     * Sets this multivector to the identity element for addition, 0.
     *
     * this ⟼ 0
     */
    zero(): this;
    /**
     * Implements this + rhs as addition.
     * The returned value is locked.
     */
    __add__(rhs: any): Geometric2;
    /**
     *
     */
    __div__(rhs: any): Geometric2;
    /**
     *
     */
    __rdiv__(lhs: any): Geometric2;
    /**
     *
     */
    __mul__(rhs: any): Geometric2;
    /**
     *
     */
    __rmul__(lhs: any): Geometric2;
    /**
     *
     */
    __radd__(lhs: any): Geometric2;
    /**
     *
     */
    __sub__(rhs: any): Geometric2;
    /**
     *
     */
    __rsub__(lhs: any): Geometric2;
    /**
     *
     */
    __wedge__(rhs: any): Geometric2;
    /**
     *
     */
    __rwedge__(lhs: any): Geometric2;
    /**
     *
     */
    __lshift__(rhs: any): Geometric2;
    /**
     *
     */
    __rlshift__(lhs: any): Geometric2;
    /**
     *
     */
    __rshift__(rhs: any): Geometric2;
    /**
     *
     */
    __rrshift__(lhs: any): Geometric2;
    /**
     *
     */
    __vbar__(rhs: any): Geometric2;
    /**
     *
     */
    __rvbar__(lhs: any): Geometric2;
    /**
     *
     */
    __bang__(): Geometric2;
    /**
     *
     */
    __tilde__(): Geometric2;
    /**
     *
     */
    __pos__(): Geometric2;
    /**
     *
     */
    __neg__(): Geometric2;
    /**
     *
     */
    static copy(M: GeometricE2): Geometric2;
    /**
     * The basis element corresponding to the vector `x` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly E1: Geometric2;
    /**
     * Constructs the basis vector e1.
     * Locking the vector prevents mutation.
     */
    static e1(lock?: boolean): Geometric2;
    /**
     * The basis element corresponding to the vector `y` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly E2: Geometric2;
    /**
     * Constructs the basis vector e2.
     * Locking the vector prevents mutation.
     */
    static e2(lock?: boolean): Geometric2;
    /**
     *
     */
    static fromCartesian(a: number, x: number, y: number, b: number): Geometric2;
    static fromBivector(B: Pseudo): Geometric2;
    /**
     *
     */
    static fromSpinor(spinor: SpinorE2): Geometric2;
    /**
     *
     */
    static fromVector(v: VectorE2): Geometric2;
    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    static readonly PSEUDO: Geometric2;
    /**
     *
     */
    static I(lock?: boolean): Geometric2;
    /**
     * A + α * (B - A)
     */
    static lerp(A: GeometricE2, B: GeometricE2, α: number): Geometric2;
    /**
     * The identity element for multiplication, `1`.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly ONE: Geometric2;
    /**
     *
     */
    static one(lock?: boolean): Geometric2;
    /**
     * Computes the rotor that rotates vector a to vector b.
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2;
    /**
     *
     */
    static pseudo(β: number): Geometric2;
    /**
     *
     */
    static scalar(α: number): Geometric2;
    /**
     *
     */
    static vector(x: number, y: number): Geometric2;
    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    static readonly ZERO: Geometric2;
    /**
     *
     */
    static zero(lock?: boolean): Geometric2;
}
