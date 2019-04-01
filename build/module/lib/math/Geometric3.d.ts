import { BivectorE3 } from './BivectorE3';
import { CartesianG3 } from './CartesianG3';
import { GeometricE3 } from './GeometricE3';
import { LockableMixin as Lockable } from '../core/Lockable';
import { Scalar } from './Scalar';
import { SpinorE3 } from './SpinorE3';
import { VectorE3 } from './VectorE3';
import { VectorN } from '../atoms/VectorN';
/**
 *
 */
export declare class Geometric3 implements CartesianG3, GeometricE3, Lockable, VectorN<number> {
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
     * Constructs a <code>Geometric3</code>.
     * The multivector is initialized to zero.
     * coords [a, x, y, z, xy, yz, zx, b]
     */
    constructor(coords?: [number, number, number, number, number, number, number, number]);
    readonly length: number;
    modified: boolean;
    getComponent(i: number): number;
    /**
     * Consistently set a coordinate value in the most optimized way,
     * by checking for a change from the old value to the new value.
     * The modified flag is only set to true if the value has changed.
     * Throws an exception if this multivector is locked.
     */
    private setCoordinate;
    /**
     * The scalar part of this multivector.
     */
    a: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     */
    x: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     */
    y: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     */
    z: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
     */
    yz: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
     */
    zx: number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     */
    xy: number;
    /**
     * The pseudoscalar part of this multivector.
     */
    b: number;
    /**
     * A bitmask describing the grades.
     *
     * 0x0 = zero
     * 0x1 = scalar
     * 0x2 = vector
     * 0x4 = bivector
     * 0x8 = pseudoscalar
     */
    readonly maskG3: number;
    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * this ⟼ this + M * alpha
     *
     * @param M The multivector to be added to this multivector.
     * @param alpha An optional scale factor that multiplies the multivector argument.
     *
     * @returns this + M * alpha
     */
    add(M: GeometricE3, alpha?: number): Geometric3;
    /**
     * Adds a bivector value to this multivector.
     *
     * this ⟼ this + B
     *
     * @returns this + B
     */
    addBivector(B: BivectorE3): Geometric3;
    /**
     * Adds a pseudoscalar value to this multivector.
     *
     * this ⟼ this + I * β
     *
     * @param β The pseudoscalar value to be added to this multivector.
     * @returns this + I * β
     */
    addPseudo(β: number): Geometric3;
    /**
     * Adds a scalar value to this multivector.
     *
     * @param alpha The scalar value to be added to this multivector.
     * @return this + alpha
     */
    addScalar(alpha: number): Geometric3;
    /**
     * Adds a vector value to this multivector.
     *
     * @param v The vector to be added.
     * @param alpha The scaling factor for the vector.
     * @returns this + v * alpha
     */
    addVector(v: VectorE3, alpha?: number): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    add2(a: GeometricE3, b: GeometricE3): this;
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns The arg of <code>this</code> multivector.
     */
    arg(): Geometric3;
    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
     */
    approx(n: number): Geometric3;
    /**
     * @returns <code>copy(this)</code>
     */
    clone(): Geometric3;
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    conj(): Geometric3;
    /**
     * Copies the coordinate values into this <code>Geometric3</code>.
     *
     * @param coordinates The coordinates in order a, x, y, z, yz, zx, xy, b.
     */
    copyCoordinates(coordinates: number[]): this;
    /**
     * @param point
     */
    distanceTo(point: VectorE3): number;
    /**
     * Computes the quadrance from this position (vector) to the specified point.
     */
    quadranceTo(point: VectorE3): number;
    /**
     * Left contraction of this multivector with another multivector.
     * @param m
     * @returns this << m
     */
    lco(m: GeometricE3): Geometric3;
    /**
     * Sets this multivector to a << b
     *
     * @param a
     * @param b
     * @returns a << b
     */
    lco2(a: GeometricE3, b: GeometricE3): this;
    /**
     * Right contraction.
     *
     * A >> B = grade(A * B, a - b) = <code>A.rco(B)</code>
     *
     * @returns this >> rhs
     */
    rco(m: GeometricE3): this;
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    rco2(a: GeometricE3, b: GeometricE3): this;
    /**
     * Sets this multivector to be a copy of another multivector.
     * @returns copy(M)
     */
    copy(M: GeometricE3): this;
    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     */
    copyScalar(α: number): this;
    /**
     * Copies the spinor argument value into this multivector.
     * The non-spinor components are set to zero.
     *
     * @param spinor The spinor to be copied.
     */
    copySpinor(spinor: SpinorE3): this;
    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    copyVector(vector: VectorE3): this;
    /**
     * Sets this multivector to the generalized vector cross product with another multivector.
     * <p>
     * <code>this ⟼ -I * (this ^ m)</code>
     * </p>
     */
    cross(m: GeometricE3): Geometric3;
    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     *
     * @param m The multivector dividend.
     * @returns this / m
     */
    div(m: GeometricE3): Geometric3;
    /**
     * Division of this multivector by a scalar.
     *
     * @returns this / alpha
     */
    divByScalar(alpha: number): Geometric3;
    /**
     * this ⟼ this / v
     *
     * @param v The vector on the right hand side of the / operator.
     * @returns this / v
     */
    divByVector(v: VectorE3): Geometric3;
    /**
     * this ⟼ a / b
     */
    div2(a: SpinorE3, b: SpinorE3): this;
    /**
     * this ⟼ dual(m) = I * m
     */
    dual(m?: GeometricE3): Geometric3;
    /**
     * @param other
     * @returns
     */
    equals(other: any): boolean;
    /**
     * this ⟼ exp(this)
     */
    exp(): Geometric3;
    /**
     * @returns inverse(this)
     */
    inv(): Geometric3;
    /**
     * Determins whether this multivector is exactly zero.
     */
    isOne(): boolean;
    /**
     * Determins whether this multivector is exactly one.
     */
    isZero(): boolean;
    /**
     * @returns this + α * (target - this)
     */
    lerp(target: GeometricE3, α: number): Geometric3;
    /**
     * Linear interpolation.
     * Sets this multivector to a + α * (b - a)
     */
    lerp2(a: GeometricE3, b: GeometricE3, α: number): this;
    /**
     * this ⟼ log(this)
     *
     * @returns log(this)
     */
    log(): Geometric3;
    /**
     * magnitude(this) = sqrt(this | ~this)
     */
    magnitude(): number;
    /**
     * this ⟼ this * m
     *
     * @returns this * m
     */
    mul(m: GeometricE3): Geometric3;
    private mulByVector;
    /**
     * this ⟼ a * b
     */
    mul2(a: GeometricE3, b: GeometricE3): this;
    /**
     * this ⟼ -1 * this
     *
     * @returns -1 * this
     */
    neg(): Geometric3;
    /**
     * norm(A) = |A| = A | ~A, where | is the scalar product and ~ is reversion.
     *
     * this ⟼ magnitude(this) = sqrt(scp(this, rev(this))) = sqrt(this | ~this)
     *
     * @returns norm(this)
     */
    norm(): Geometric3;
    /**
     * @returns this / magnitude(this)
     */
    direction(): Geometric3;
    /**
     * this ⟼ this / magnitude(this)
     *
     * If the magnitude is zero (a null multivector), this multivector is unchanged.
     * Since the metric is Euclidean, this will only happen if the multivector is also the
     * zero multivector.
     */
    normalize(): Geometric3;
    /**
     * Sets this multivector to the identity element for multiplication, 1.
     */
    one(): this;
    /**
     * squaredNorm(A) = |A||A| = A | ~A
     *
     * Returns the (squared) norm of this multivector.
     *
     * If this multivector is mutable (unlocked), then it is set to the squared norm of this multivector,
     * and the return value is this multivector.
     * If thus multivector is immutable (locked), then a new multivector is returned which is also immutable.
     *
     * this ⟼ squaredNorm(this) = scp(this, rev(this)) = this | ~this
     *
     * @returns squaredNorm(this)
     */
    squaredNorm(): Geometric3;
    /**
     * Computes the square of the magnitude.
     */
    quaditude(): number;
    /**
     * Sets this multivector to its reflection in the plane orthogonal to vector n.
     *
     * Mathematically,
     *
     * this ⟼ - n * this * n
     *
     * Geometrically,
     *
     * Reflects this multivector in the plane orthogonal to the unit vector, n.
     *
     * If n is not a unit vector then the result is scaled by n squared.
     *
     * @param n The unit vector that defines the reflection plane.
     */
    reflect(n: VectorE3): Geometric3;
    /**
     * this ⟼ reverse(this)
     */
    rev(): Geometric3;
    /**
     * Rotates this multivector using a rotor, R.
     *
     * @returns R * this * reverse(R) = R * this * ~R
     */
    rotate(R: SpinorE3): Geometric3;
    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
     *
     * @param axis The (unit) vector defining the rotation direction.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): this;
    /**
     * Computes a rotor, R, from two unit vectors, where
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     *
     * @param a The starting vector
     * @param b The ending vector
     * @returns The rotor representing a rotation from a to b.
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): this;
    /**
     * Helper function for rotorFromFrameToFrame.
     */
    private rotorFromTwoVectors;
    /**
     *
     */
    rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): this;
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromGeneratorAngle(B: BivectorE3, θ: number): this;
    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     */
    rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3 | undefined): this;
    /**
     * Scalar Product
     * @returns scp(this, rhs) = this | rhs
     */
    scp(rhs: GeometricE3): Geometric3;
    /**
     * this ⟼ scp(a, b) = a | b
     */
    scp2(a: GeometricE3, b: GeometricE3): this;
    /**
     * this ⟼ this * alpha
     */
    scale(alpha: number): Geometric3;
    /**
     * Applies the diagonal elements of a scaling matrix to this multivector.
     *
     * @param σ
     */
    stress(σ: VectorE3): Geometric3;
    /**
     * Sets this multivector to the geometric product of the arguments.
     * This multivector must be mutable (in the unlocked state).
     *
     * this ⟼ a * b
     *
     * @param a The vector on the left of the operator.
     * @param b The vector on the right of the operator.
     *
     * @returns the geometric product, a * b, of the vector arguments.
     */
    versor(a: VectorE3, b: VectorE3): this;
    /**
     * @returns this - M * α
     */
    sub(M: GeometricE3, α?: number): Geometric3;
    /**
     * <p>
     * <code>this ⟼ this - v * α</code>
     * </p>
     *
     * @param v
     * @param α
     * @returns this - v * α
     */
    subVector(v: VectorE3, α?: number): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    sub2(a: GeometricE3, b: GeometricE3): this;
    /**
     *
     */
    toArray(): number[];
    /**
     * Returns a string representing the number in exponential notation.
     */
    toExponential(fractionDigits?: number): string;
    /**
     * Returns a string representing the number in fixed-point notation.
     */
    toFixed(fractionDigits?: number): string;
    /**
     *
     */
    toPrecision(precision?: number): string;
    /**
     * Returns a string representation of this multivector.
     */
    toString(radix?: number): string;
    /**
     * Extraction of grade <em>i</em>.
     *
     * If this multivector is mutable (unlocked) then it is set to the result.
     *
     * @param i The index of the grade to be extracted.
     */
    grade(i: number): Geometric3;
    /**
     * @returns this ^ m
     */
    ext(m: GeometricE3): Geometric3;
    /**
     * Sets this multivector to the outer product of `a` and `b`.
     * this ⟼ a ^ b
     */
    ext2(a: GeometricE3, b: GeometricE3): this;
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): this;
    /**
     * Implements `this + rhs` as addition.
     * The returned value is locked.
     */
    __add__(rhs: number | CartesianG3): Geometric3 | undefined;
    /**
     * Implements `lhs + this` as addition.
     * The returned value is locked.
     */
    __radd__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `this / rhs` as division.
     * The returned value is locked.
     */
    __div__(rhs: number | CartesianG3): Geometric3 | undefined;
    /**
     * Implements `lhs / this` as division.
     * The returned value is locked.
     */
    __rdiv__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `this * rhs` as the geometric product.
     * The returned value is locked.
     */
    __mul__(rhs: number | CartesianG3): Geometric3 | undefined;
    /**
     * Implements `lhs * this` as the geometric product.
     * The returned value is locked.
     */
    __rmul__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `this - rhs` as subtraction.
     * The returned value is locked.
     */
    __sub__(rhs: number | CartesianG3): Geometric3 | undefined;
    /**
     * Implements `lhs - this` as subtraction.
     * The returned value is locked.
     */
    __rsub__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `this ^ rhs` as the extension.
     * The returned value is locked.
     */
    __wedge__(rhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `lhs ^ this` as the extension.
     * The returned value is locked.
     */
    __rwedge__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `this << rhs` as the left contraction.
     * The returned value is locked.
     */
    __lshift__(rhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `lhs << this` as the left contraction.
     * The returned value is locked.
     */
    __rlshift__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `this >> rhs` as the right contraction.
     * The returned value is locked.
     */
    __rshift__(rhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `lhs >> this` as the right contraction.
     * The returned value is locked.
     */
    __rrshift__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `this | rhs` as the scalar product.
     * The returned value is locked.
     */
    __vbar__(rhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `lhs | this` as the scalar product.
     * The returned value is locked.
     */
    __rvbar__(lhs: number | Geometric3): Geometric3 | undefined;
    /**
     * Implements `!this` as the inverse (if it exists) of `this`.
     * The returned value is locked.
     */
    __bang__(): Geometric3;
    /**
     * Implements `+this` as `this`.
     * The returned value is locked.
     */
    __pos__(): Geometric3;
    /**
     * Implements `-this` as the negative of `this`.
     * The returned value is locked.
     */
    __neg__(): Geometric3;
    /**
     * Implements `~this` as the reversion of `this`.
     * The returned value is locked.
     */
    __tilde__(): Geometric3;
    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    static readonly ZERO: Geometric3;
    /**
     * The identity element for multiplication, `1`.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly ONE: Geometric3;
    /**
     *
     */
    static one(lock?: boolean): Geometric3;
    /**
     * The basis element corresponding to the vector `x` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly E1: Geometric3;
    /**
     * Constructs the basis vector e1.
     * Locking the vector prevents mutation.
     */
    static e1(lock?: boolean): Geometric3;
    /**
     * The basis element corresponding to the vector `y` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly E2: Geometric3;
    /**
     * Constructs the basis vector e2.
     * Locking the vector prevents mutation.
     */
    static e2(lock?: boolean): Geometric3;
    /**
     * The basis element corresponding to the vector `z` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly E3: Geometric3;
    /**
     * Constructs the basis vector e3.
     * Locking the vector prevents mutation.
     */
    static e3(lock?: boolean): Geometric3;
    /**
     * The basis element corresponding to the pseudoscalar `b` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    static readonly PSEUDO: Geometric3;
    /**
     *
     */
    static I(lock?: boolean): Geometric3;
    /**
     * Constructs a mutable bivector with the coordinates `yz`, `zx`, and `xy`.
     */
    static bivector(yz: number, zx: number, xy: number): Geometric3;
    /**
     * Constructs a mutable multivector by copying a multivector.
     */
    static copy(M: GeometricE3): Geometric3;
    /**
     * Constructs a mutable multivector which is the dual of the bivector `B`.
     */
    static dualOfBivector(B: BivectorE3): Geometric3;
    /**
     * Constructs a mutable multivector which is the dual of the vector `v`.
     */
    static dualOfVector(v: VectorE3): Geometric3;
    /**
     * Constructs a mutable multivector by copying the bivector `B`.
     */
    static fromBivector(B: BivectorE3): Geometric3;
    /**
     * Constructs a mutable multivector by copying the scalar `α`.
     */
    static fromScalar(α: Scalar): Geometric3;
    /**
     * Constructs a mutable multivector by copying the spinor `s`.
     */
    static fromSpinor(s: SpinorE3): Geometric3;
    /**
     * Constructs a mutable multivector by copying the vector `v`.
     */
    static fromVector(v: VectorE3): Geometric3;
    /**
     * Constructs a mutable multivector that linearly interpolates `A` and `B`, A + α * (B - A)
     */
    static lerp(A: GeometricE3, B: GeometricE3, α: number): Geometric3;
    /**
     * Constructs a mutable pseudoscalar with the magnitude `β`.
     */
    static pseudo(β: number): Geometric3;
    /**
     * Computes a multivector with random components in the range [lowerBound, upperBound].
     */
    static random(lowerBound?: number, upperBound?: number): Geometric3;
    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;
    static rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): Geometric3;
    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The bivector B provides the plane of rotation when `a` and `b` are anti-aligned.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    static rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3;
    /**
     * Constructs a mutable scalar with the magnitude `α`.
     */
    static scalar(α: number): Geometric3;
    /**
     * Constructs a mutable scalar with the coordinates `yz`, `zx`, `xy`, and `α`.
     */
    static spinor(yz: number, zx: number, xy: number, α: number): Geometric3;
    /**
     * Constructs a mutable vector with the coordinates `x`, `y`, and `z`.
     */
    static vector(x: number, y: number, z: number): Geometric3;
    /**
     * Constructs a mutable bivector as the outer product of two vectors.
     */
    static wedge(a: VectorE3, b: VectorE3): Geometric3;
    /**
     *
     */
    static zero(lock?: boolean): Geometric3;
}
