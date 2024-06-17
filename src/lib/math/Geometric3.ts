import { mustBeEQ } from "../checks/mustBeEQ";
import { mustBeInteger } from "../checks/mustBeInteger";
import { lock, TargetLockedError } from "../core/Lockable";
import { approx } from "./approx";
import { arraysEQ } from "./arraysEQ";
import { BivectorE3 } from "./BivectorE3";
import { CartesianG3 } from "./CartesianG3";
import { dotVectorE3 as dotVector } from "./dotVectorE3";
import { extG3 } from "./extG3";
import { gauss } from "./gauss";
import { GeometricE3 } from "./GeometricE3";
import { isScalarG3 } from "./isScalarG3";
import { isVectorE3 } from "./isVectorE3";
import { isVectorG3 } from "./isVectorG3";
import { lcoG3 } from "./lcoG3";
import { maskG3 } from "./maskG3";
import { mulE3 } from "./mulE3";
import { randomRange } from "./randomRange";
import { rcoG3 } from "./rcoG3";
import { rotorFromDirectionsE3 as rotorFromDirections } from "./rotorFromDirectionsE3";
import { Scalar } from "./Scalar";
import { scpG3 } from "./scpG3";
import { SpinorE3 } from "./SpinorE3";
import { squaredNormG3 } from "./squaredNormG3";
import { stringFromCoordinates } from "./stringFromCoordinates";
import { VectorE3 } from "./VectorE3";
import { wedgeXY } from "./wedgeXY";
import { wedgeYZ } from "./wedgeYZ";
import { wedgeZX } from "./wedgeZX";

// Symbolic constants for the coordinate indices into the data array.
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
const COORD_Z = 3;
/**
 * @hidden
 */
const COORD_XY = 4;
/**
 * @hidden
 */
const COORD_YZ = 5;
/**
 * @hidden
 */
const COORD_ZX = 6;
/**
 * @hidden
 */
const COORD_PSEUDO = 7;

// FIXME: Change to Canonical ordering.
/**
 * @hidden
 */
const BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];

/**
 * @hidden
 */
const zero = function zero(): [number, number, number, number, number, number, number, number] {
    return [0, 0, 0, 0, 0, 0, 0, 0];
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
const vector = function vector(x: number, y: number, z: number) {
    const coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    return coords;
};

/**
 * @hidden
 */
const bivector = function bivector(yz: number, zx: number, xy: number) {
    const coords = zero();
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};

/**
 * @hidden
 */
const spinor = function spinor(a: number, yz: number, zx: number, xy: number) {
    const coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};

/**
 * @hidden
 */
const multivector = function multivector(a: number, x: number, y: number, z: number, yz: number, zx: number, xy: number, b: number) {
    const coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    coords[COORD_PSEUDO] = b;
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
 * @hidden
 */
function coordinates(m: GeometricE3) {
    const coords = zero();
    coords[COORD_SCALAR] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_Z] = m.z;
    coords[COORD_YZ] = m.yz;
    coords[COORD_ZX] = m.zx;
    coords[COORD_XY] = m.xy;
    coords[COORD_PSEUDO] = m.b;
    return coords;
}

/**
 * cos(a, b) = (a | b) / |a||b|
 * @hidden
 */
function cosVectorVector(a: VectorE3, b: VectorE3): number {
    function scp(c: VectorE3, d: VectorE3): number {
        return c.x * d.x + c.y * d.y + c.z * d.z;
    }
    function norm(v: VectorE3): number {
        return Math.sqrt(scp(v, v));
    }
    return scp(a, b) / (norm(a) * norm(b));
}

/**
 * Scratch variable for holding cosines.
 * @hidden
 */
const cosines: number[] = [];

/**
 *
 */
export class Geometric3 {
    // Lockable
    public isLocked(): boolean {
        return typeof (this as any)["lock_"] === "number";
    }

    public lock(): number {
        if (this.isLocked()) {
            throw new Error("already locked");
        } else {
            (this as any)["lock_"] = Math.random();
            return (this as any)["lock_"];
        }
    }

    public unlock(token: number): void {
        if (typeof token !== "number") {
            throw new Error("token must be a number.");
        }
        if (!this.isLocked()) {
            throw new Error("not locked");
        } else if ((this as any)["lock_"] === token) {
            (this as any)["lock_"] = void 0;
        } else {
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
     * Constructs a <code>Geometric3</code>.
     * The multivector is initialized to zero.
     * coords [a, x, y, z, xy, yz, zx, b]
     */
    constructor(coords: [number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0]) {
        mustBeEQ("coords.length", coords.length, 8);
        this.coords_ = coords;
        this.modified_ = false;
    }

    get length(): number {
        return 8;
    }

    get modified(): boolean {
        return this.modified_;
    }
    set modified(modified: boolean) {
        if (this.isLocked()) {
            throw new TargetLockedError("set modified");
        }
        this.modified_ = modified;
    }

    getComponent(i: number): number {
        return this.coords_[i];
    }

    /**
     * Consistently set a coordinate value in the most optimized way,
     * by checking for a change from the old value to the new value.
     * The modified flag is only set to true if the value has changed.
     * Throws an exception if this multivector is locked.
     */
    private setCoordinate(index: number, newValue: number, name: string) {
        if (this.isLocked()) {
            throw new TargetLockedError(`set ${name}`);
        }
        const coords = this.coords_;
        const oldValue = coords[index];
        if (newValue !== oldValue) {
            coords[index] = newValue;
            this.modified_ = true;
        }
    }

    /**
     * The scalar part of this multivector.
     */
    get a(): number {
        return this.coords_[COORD_SCALAR];
    }
    set a(a: number) {
        this.setCoordinate(COORD_SCALAR, a, "a");
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     */
    get x(): number {
        return this.coords_[COORD_X];
    }
    set x(x: number) {
        this.setCoordinate(COORD_X, x, "x");
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     */
    get y(): number {
        return this.coords_[COORD_Y];
    }
    set y(y: number) {
        this.setCoordinate(COORD_Y, y, "y");
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     */
    get z(): number {
        return this.coords_[COORD_Z];
    }
    set z(z: number) {
        this.setCoordinate(COORD_Z, z, "z");
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
     */
    get yz(): number {
        return this.coords_[COORD_YZ];
    }
    set yz(yz: number) {
        this.setCoordinate(COORD_YZ, yz, "yz");
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
     */
    get zx(): number {
        return this.coords_[COORD_ZX];
    }
    set zx(zx: number) {
        this.setCoordinate(COORD_ZX, zx, "zx");
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     */
    get xy(): number {
        return this.coords_[COORD_XY];
    }
    set xy(xy: number) {
        this.setCoordinate(COORD_XY, xy, "xy");
    }

    /**
     * The pseudoscalar part of this multivector.
     */
    get b(): number {
        return this.coords_[COORD_PSEUDO];
    }
    set b(b: number) {
        this.setCoordinate(COORD_PSEUDO, b, "b");
    }

    /**
     * A bitmask describing the grades.
     *
     * 0x0 = zero
     * 0x1 = scalar
     * 0x2 = vector
     * 0x4 = bivector
     * 0x8 = pseudoscalar
     */
    get maskG3(): number {
        const coords = this.coords_;
        const α = coords[COORD_SCALAR];
        const x = coords[COORD_X];
        const y = coords[COORD_Y];
        const z = coords[COORD_Z];
        const yz = coords[COORD_YZ];
        const zx = coords[COORD_ZX];
        const xy = coords[COORD_XY];
        const β = coords[COORD_PSEUDO];
        let mask = 0x0;
        if (α !== 0) {
            mask += 0x1;
        }
        if (x !== 0 || y !== 0 || z !== 0) {
            mask += 0x2;
        }
        if (yz !== 0 || zx !== 0 || xy !== 0) {
            mask += 0x4;
        }
        if (β !== 0) {
            mask += 0x8;
        }
        return mask;
    }

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
    add(M: GeometricE3, alpha = 1): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().add(M, alpha));
        } else {
            this.a += M.a * alpha;
            this.x += M.x * alpha;
            this.y += M.y * alpha;
            this.z += M.z * alpha;
            this.yz += M.yz * alpha;
            this.zx += M.zx * alpha;
            this.xy += M.xy * alpha;
            this.b += M.b * alpha;
            return this;
        }
    }

    /**
     * Adds a bivector value to this multivector.
     *
     * this ⟼ this + B
     *
     * @returns this + B
     */
    addBivector(B: BivectorE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().addBivector(B));
        } else {
            this.yz += B.yz;
            this.zx += B.zx;
            this.xy += B.xy;
            return this;
        }
    }

    /**
     * Adds a pseudoscalar value to this multivector.
     *
     * this ⟼ this + I * β
     *
     * @param β The pseudoscalar value to be added to this multivector.
     * @returns this + I * β
     */
    addPseudo(β: number): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().addPseudo(β));
        } else {
            this.b += β;
            return this;
        }
    }

    /**
     * Adds a scalar value to this multivector.
     *
     * @param alpha The scalar value to be added to this multivector.
     * @return this + alpha
     */
    addScalar(alpha: number): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().addScalar(alpha));
        } else {
            this.a += alpha;
            return this;
        }
    }

    /**
     * Adds a vector value to this multivector.
     *
     * @param v The vector to be added.
     * @param alpha The scaling factor for the vector.
     * @returns this + v * alpha
     */
    addVector(v: VectorE3, alpha = 1): Geometric3 {
        if (this.isLocked()) {
            return this.clone().addVector(v, alpha);
        } else {
            this.x += v.x * alpha;
            this.y += v.y * alpha;
            this.z += v.z * alpha;
            return this;
        }
    }

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    add2(a: GeometricE3, b: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("add2");
        }
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.yz = a.yz + b.yz;
        this.zx = a.zx + b.zx;
        this.xy = a.xy + b.xy;
        this.b = a.b + b.b;
        return this;
    }

    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns The arg of <code>this</code> multivector.
     */
    arg(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().arg());
        } else {
            return this.log().grade(2);
        }
    }

    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
     */
    approx(n: number): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().approx(n));
        } else {
            approx(this.coords_, n);
            return this;
        }
    }

    /**
     * @returns <code>copy(this)</code>
     */
    clone(): Geometric3 {
        return Geometric3.copy(this);
    }

    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    conj(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().conj());
        } else {
            // The grade 0 (scalar) coordinate is unchanged.
            // The grade 1 (vector) coordinates change sign.
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            // The grade 2 (bivector) coordinates change sign.
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            // The grade 3 (pseudoscalar) coordinate is unchanged.
            return this;
        }
    }

    /**
     * Copies the coordinate values into this <code>Geometric3</code>.
     *
     * @param coordinates The coordinates in order a, x, y, z, yz, zx, xy, b.
     */
    copyCoordinates(coordinates: number[]): this {
        if (this.isLocked()) {
            throw new TargetLockedError("copyCoordinates");
        }
        // Copy using the setters so that the modified flag is updated.
        this.a = coordinates[COORD_SCALAR];
        this.x = coordinates[COORD_X];
        this.y = coordinates[COORD_Y];
        this.z = coordinates[COORD_Z];
        this.yz = coordinates[COORD_YZ];
        this.zx = coordinates[COORD_ZX];
        this.xy = coordinates[COORD_XY];
        this.b = coordinates[COORD_PSEUDO];
        return this;
    }

    /**
     * @param point
     */
    distanceTo(point: VectorE3): number {
        if (point) {
            return Math.sqrt(this.quadranceTo(point));
        } else {
            throw new Error("point must be a VectorE3");
        }
    }

    /**
     * Computes the quadrance from this position (vector) to the specified point.
     */
    quadranceTo(point: VectorE3): number {
        if (point) {
            const dx = this.x - point.x;
            const dy = this.y - point.y;
            const dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
        } else {
            throw new Error("point must be a VectorE3");
        }
    }

    /**
     * Left contraction of this multivector with another multivector.
     * @param m
     * @returns this << m
     */
    lco(m: GeometricE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().lco(m));
        } else {
            return this.lco2(this, m);
        }
    }

    /**
     * Sets this multivector to a << b
     *
     * @param a
     * @param b
     * @returns a << b
     */
    lco2(a: GeometricE3, b: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("lco2");
        }
        return lcoG3(a, b, this);
    }

    /**
     * Right contraction.
     *
     * A >> B = grade(A * B, a - b) = <code>A.rco(B)</code>
     *
     * @returns this >> rhs
     */
    rco(m: GeometricE3): this {
        return this.rco2(this, m);
    }

    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    rco2(a: GeometricE3, b: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("rco2");
        }
        return rcoG3(a, b, this);
    }

    /**
     * Sets this multivector to be a copy of another multivector.
     * @returns copy(M)
     */
    copy(M: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("copy");
        }
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.z = M.z;
        this.yz = M.yz;
        this.zx = M.zx;
        this.xy = M.xy;
        this.b = M.b;

        return this;
    }

    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     */
    copyScalar(α: number): this {
        if (this.isLocked()) {
            throw new TargetLockedError("copyScalar");
        }
        this.setCoordinate(COORD_SCALAR, α, "a");
        this.setCoordinate(COORD_X, 0, "x");
        this.setCoordinate(COORD_Y, 0, "y");
        this.setCoordinate(COORD_Z, 0, "z");
        this.setCoordinate(COORD_YZ, 0, "yz");
        this.setCoordinate(COORD_ZX, 0, "zx");
        this.setCoordinate(COORD_XY, 0, "xy");
        this.setCoordinate(COORD_PSEUDO, 0, "b");
        return this;
    }

    /**
     * Copies the spinor argument value into this multivector.
     * The non-spinor components are set to zero.
     *
     * @param spinor The spinor to be copied.
     */
    copySpinor(spinor: SpinorE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("copySpinor");
        }
        this.setCoordinate(COORD_SCALAR, spinor.a, "a");
        this.setCoordinate(COORD_X, 0, "x");
        this.setCoordinate(COORD_Y, 0, "y");
        this.setCoordinate(COORD_Z, 0, "z");
        this.setCoordinate(COORD_YZ, spinor.yz, "yz");
        this.setCoordinate(COORD_ZX, spinor.zx, "zx");
        this.setCoordinate(COORD_XY, spinor.xy, "xy");
        this.setCoordinate(COORD_PSEUDO, 0, "b");
        return this;
    }

    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    copyVector(vector: VectorE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("copyVector");
        }
        this.setCoordinate(COORD_SCALAR, 0, "a");
        this.setCoordinate(COORD_X, vector.x, "x");
        this.setCoordinate(COORD_Y, vector.y, "y");
        this.setCoordinate(COORD_Z, vector.z, "z");
        this.setCoordinate(COORD_YZ, 0, "yz");
        this.setCoordinate(COORD_ZX, 0, "zx");
        this.setCoordinate(COORD_XY, 0, "xy");
        this.setCoordinate(COORD_PSEUDO, 0, "b");
        return this;
    }

    /**
     * Sets this multivector to the generalized vector cross product with another multivector.
     *
     * this ⟼ dual(this ^ m)
     */
    cross(m: GeometricE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().cross(m));
        } else {
            return this.ext(m).dual();
        }
    }

    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     *
     * @param m The multivector dividend.
     * @returns this / m
     */
    div(m: GeometricE3): Geometric3 {
        if (isScalarG3(m)) {
            return this.divByScalar(m.a);
        } else if (isVectorG3(m)) {
            return this.divByVector(m);
        } else {
            if (this.isLocked()) {
                return lock(this.clone().div(m));
            } else {
                const α = m.a;
                const x = m.x;
                const y = m.y;
                const z = m.z;
                const xy = m.xy;
                const yz = m.yz;
                const zx = m.zx;
                const β = m.b;

                const A = [
                    [α, x, y, z, -xy, -yz, -zx, -β],
                    [x, α, xy, -zx, -y, -β, z, -yz],
                    [y, -xy, α, yz, x, -z, -β, -zx],
                    [z, zx, -yz, α, -β, y, -x, -xy],
                    [xy, -y, x, β, α, zx, -yz, z],
                    [yz, β, -z, y, -zx, α, xy, x],
                    [zx, z, β, -x, yz, -xy, α, y],
                    [β, yz, zx, xy, z, x, y, α]
                ];

                const b = [1, 0, 0, 0, 0, 0, 0, 0];

                const X = gauss(A, b);

                const a0 = this.a;
                const a1 = this.x;
                const a2 = this.y;
                const a3 = this.z;
                const a4 = this.xy;
                const a5 = this.yz;
                const a6 = this.zx;
                const a7 = this.b;

                const b0 = X[0];
                const b1 = X[1];
                const b2 = X[2];
                const b3 = X[3];
                const b4 = X[4];
                const b5 = X[5];
                const b6 = X[6];
                const b7 = X[7];

                const c0 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                const c1 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                const c2 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                const c3 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                const c4 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                const c5 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                const c6 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                const c7 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);

                this.a = c0;
                this.x = c1;
                this.y = c2;
                this.z = c3;
                this.xy = c4;
                this.yz = c5;
                this.zx = c6;
                this.b = c7;
            }
            return this;
        }
    }

    /**
     * Division of this multivector by a scalar.
     *
     * @returns this / alpha
     */
    divByScalar(alpha: number): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().divByScalar(alpha));
        } else {
            this.a /= alpha;
            this.x /= alpha;
            this.y /= alpha;
            this.z /= alpha;
            this.yz /= alpha;
            this.zx /= alpha;
            this.xy /= alpha;
            this.b /= alpha;
            return this;
        }
    }

    /**
     * this ⟼ this / v
     *
     * @param v The vector on the right hand side of the / operator.
     * @returns this / v
     */
    divByVector(v: VectorE3): Geometric3 {
        if (this.isLocked()) {
            return this.clone().divByVector(v);
        } else {
            const x = v.x;
            const y = v.y;
            const z = v.z;
            const squaredNorm = x * x + y * y + z * z;
            return this.mulByVector(v).divByScalar(squaredNorm);
        }
    }

    /**
     * this ⟼ a / b
     */
    div2(a: SpinorE3, b: SpinorE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("div2");
        } else {
            // FIXME: Generalize
            const a0 = a.a;
            const a1 = a.yz;
            const a2 = a.zx;
            const a3 = a.xy;
            const b0 = b.a;
            const b1 = b.yz;
            const b2 = b.zx;
            const b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.a = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        }
    }

    dual(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().dual());
        } else {
            const a = this.b;
            const x = this.yz;
            const y = this.zx;
            const z = this.xy;
            const yz = -this.x;
            const zx = -this.y;
            const xy = -this.z;
            const b = -this.a;

            this.a = a;
            this.x = x;
            this.y = y;
            this.z = z;
            this.yz = yz;
            this.zx = zx;
            this.xy = xy;
            this.b = b;

            return this;
        }
    }

    /**
     * @param other
     * @returns
     */
    equals(other: any): boolean {
        if (other instanceof Geometric3) {
            const that: Geometric3 = other;
            return arraysEQ(this.coords_, that.coords_);
        } else {
            return false;
        }
    }

    /**
     * this ⟼ exp(this)
     */
    exp(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().exp());
        } else {
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            const expW = Math.exp(this.a);

            // In Geometric3 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            // let cosβ = cos(this.b)
            // let sinβ = sin(this.b)

            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            const yz = this.yz;
            const zx = this.zx;
            const xy = this.xy;
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            const φ = Math.sqrt(yz * yz + zx * zx + xy * xy);
            const s = φ !== 0 ? Math.sin(φ) / φ : 1;
            const cosφ = Math.cos(φ);

            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.a = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.scale(expW);
        }
    }

    /**
     * @returns inverse(this)
     */
    inv(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().inv());
        } else {
            const α = this.a;
            const x = this.x;
            const y = this.y;
            const z = this.z;
            const xy = this.xy;
            const yz = this.yz;
            const zx = this.zx;
            const β = this.b;

            const A = [
                [α, x, y, z, -xy, -yz, -zx, -β],
                [x, α, xy, -zx, -y, -β, z, -yz],
                [y, -xy, α, yz, x, -z, -β, -zx],
                [z, zx, -yz, α, -β, y, -x, -xy],
                [xy, -y, x, β, α, zx, -yz, z],
                [yz, β, -z, y, -zx, α, xy, x],
                [zx, z, β, -x, yz, -xy, α, y],
                [β, yz, zx, xy, z, x, y, α]
            ];

            const b = [1, 0, 0, 0, 0, 0, 0, 0];

            const X = gauss(A, b);

            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.z = X[3];
            this.xy = X[4];
            this.yz = X[5];
            this.zx = X[6];
            this.b = X[7];

            return this;
        }
    }

    /**
     * Determins whether this multivector is exactly zero.
     */
    isOne(): boolean {
        return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    }

    /**
     * Determins whether this multivector is exactly one.
     */
    isZero(): boolean {
        return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    }

    /**
     * @returns this + α * (target - this)
     */
    lerp(target: GeometricE3, α: number): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().lerp(target, α));
        } else {
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    }

    /**
     * Linear interpolation.
     * Sets this multivector to a + α * (b - a)
     */
    lerp2(a: GeometricE3, b: GeometricE3, α: number): this {
        if (this.isLocked()) {
            throw new TargetLockedError("lerp2");
        }
        this.copy(a).lerp(b, α);
        return this;
    }

    /**
     * this ⟼ log(this)
     *
     * @returns log(this)
     */
    log(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().log());
        } else {
            const α = this.a;
            const x = this.yz;
            const y = this.zx;
            const z = this.xy;
            const BB = x * x + y * y + z * z;
            const B = Math.sqrt(BB);
            const f = Math.atan2(B, α) / B;
            this.a = Math.log(Math.sqrt(α * α + BB));
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        }
    }

    /**
     * magnitude(this) = sqrt(this | ~this)
     */
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }

    /**
     * this ⟼ this * m
     *
     * @returns this * m
     */
    mul(m: GeometricE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().mul(m));
        } else {
            return this.mul2(this, m);
        }
    }

    private mulByVector(vector: VectorE3): this {
        const a0 = this.a;
        const a1 = this.x;
        const a2 = this.y;
        const a3 = this.z;
        const a4 = this.xy;
        const a5 = this.yz;
        const a6 = this.zx;
        const a7 = this.b;

        const b0 = 0;
        const b1 = vector.x;
        const b2 = vector.y;
        const b3 = vector.z;
        const b4 = 0;
        const b5 = 0;
        const b6 = 0;
        const b7 = 0;

        // TODO: substitute a cheaper multiplication function.
        this.a = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        this.x = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        this.y = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        this.z = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        this.xy = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        this.yz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        this.zx = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        this.b = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);

        return this;
    }

    /**
     * this ⟼ a * b
     */
    mul2(a: GeometricE3, b: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("mul2");
        }
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.z;
        const a4 = a.xy;
        const a5 = a.yz;
        const a6 = a.zx;
        const a7 = a.b;

        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.z;
        const b4 = b.xy;
        const b5 = b.yz;
        const b6 = b.zx;
        const b7 = b.b;

        this.a = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        this.x = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        this.y = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        this.z = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        this.xy = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        this.yz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        this.zx = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        this.b = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);

        return this;
    }

    /**
     * this ⟼ -1 * this
     *
     * @returns -1 * this
     */
    neg(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().neg());
        } else {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        }
    }

    /**
     * norm(A) = |A| = A | ~A, where | is the scalar product and ~ is reversion.
     *
     * this ⟼ magnitude(this) = sqrt(scp(this, rev(this))) = sqrt(this | ~this)
     *
     * @returns norm(this)
     */
    norm(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().norm());
        } else {
            this.a = this.magnitude();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        }
    }

    /**
     * @returns this / magnitude(this)
     */
    direction(): Geometric3 {
        return this.normalize();
    }

    /**
     * this ⟼ this / magnitude(this)
     *
     * If the magnitude is zero (a null multivector), this multivector is unchanged.
     * Since the metric is Euclidean, this will only happen if the multivector is also the
     * zero multivector.
     */
    normalize(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().normalize());
        } else {
            const norm: number = this.magnitude();
            if (norm !== 0) {
                this.a = this.a / norm;
                this.x = this.x / norm;
                this.y = this.y / norm;
                this.z = this.z / norm;
                this.yz = this.yz / norm;
                this.zx = this.zx / norm;
                this.xy = this.xy / norm;
                this.b = this.b / norm;
            }
            return this;
        }
    }

    /**
     * Sets this multivector to the identity element for multiplication, 1.
     */
    one(): this {
        if (this.isLocked()) {
            throw new TargetLockedError("one");
        }
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        this.b = 0;
        return this;
    }

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
    public squaredNorm(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().squaredNorm());
        } else {
            this.a = squaredNormG3(this);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        }
    }

    /**
     * Computes the square of the magnitude.
     */
    public quaditude(): number {
        return squaredNormG3(this);
    }

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
    reflect(n: VectorE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().reflect(n));
        } else {
            const n1 = n.x;
            const n2 = n.y;
            const n3 = n.z;
            const n11 = n1 * n1;
            const n22 = n2 * n2;
            const n33 = n3 * n3;
            const nn = n11 + n22 + n33;
            const f1 = 2 * n2 * n3;
            const f2 = 2 * n3 * n1;
            const f3 = 2 * n1 * n2;
            const t1 = n22 + n33 - n11;
            const t2 = n33 + n11 - n22;
            const t3 = n11 + n22 - n33;
            const cs = this.coords_;
            const a = cs[COORD_SCALAR];
            const x1 = cs[COORD_X];
            const x2 = cs[COORD_Y];
            const x3 = cs[COORD_Z];
            const B3 = cs[COORD_XY];
            const B1 = cs[COORD_YZ];
            const B2 = cs[COORD_ZX];
            const b = cs[COORD_PSEUDO];
            this.setCoordinate(COORD_SCALAR, -nn * a, "a");
            this.setCoordinate(COORD_X, x1 * t1 - x2 * f3 - x3 * f2, "x");
            this.setCoordinate(COORD_Y, x2 * t2 - x3 * f1 - x1 * f3, "y");
            this.setCoordinate(COORD_Z, x3 * t3 - x1 * f2 - x2 * f1, "z");
            this.setCoordinate(COORD_XY, B3 * t3 - B1 * f2 - B2 * f1, "xy");
            this.setCoordinate(COORD_YZ, B1 * t1 - B2 * f3 - B3 * f2, "yz");
            this.setCoordinate(COORD_ZX, B2 * t2 - B3 * f1 - B1 * f3, "zx");
            this.setCoordinate(COORD_PSEUDO, -nn * b, "b");
            return this;
        }
    }

    /**
     * this ⟼ reverse(this)
     */
    rev(): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().rev());
        } else {
            // reverse has a ++-- structure on the grades.
            this.a = +this.a;
            this.x = +this.x;
            this.y = +this.y;
            this.z = +this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        }
    }

    /**
     * Rotates this multivector using a rotor, R.
     *
     * @returns R * this * reverse(R) = R * this * ~R
     */
    rotate(R: SpinorE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().rotate(R));
        } else {
            // TODO: This only rotates the vector components. The bivector components will change.
            const x = this.x;
            const y = this.y;
            const z = this.z;

            const a = R.xy;
            const b = R.yz;
            const c = R.zx;
            const α = R.a;

            const ix = α * x - c * z + a * y;
            const iy = α * y - a * x + b * z;
            const iz = α * z - b * y + c * x;
            const iα = b * x + c * y + a * z;

            this.x = ix * α + iα * b + iy * a - iz * c;
            this.y = iy * α + iα * c + iz * b - ix * a;
            this.z = iz * α + iα * a + ix * c - iy * b;

            return this;
        }
    }

    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
     *
     * @param axis The (unit) vector defining the rotation direction.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): this {
        if (this.isLocked()) {
            throw new TargetLockedError("rotorFromAxisAngle");
        }
        // Compute the dual of the axis to obtain the corresponding bivector.
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const squaredNorm = x * x + y * y + z * z;
        if (squaredNorm === 1) {
            return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z }, θ);
        } else {
            const norm = Math.sqrt(squaredNorm);
            const yz = x / norm;
            const zx = y / norm;
            const xy = z / norm;
            return this.rotorFromGeneratorAngle({ yz, zx, xy }, θ);
        }
    }

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
    rotorFromDirections(a: VectorE3, b: VectorE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("rotorFromDirections");
        }
        const B: BivectorE3 | undefined = void 0;
        return this.rotorFromVectorToVector(a, b, B);
    }

    /**
     * Helper function for rotorFromFrameToFrame.
     */
    private rotorFromTwoVectors(e1: VectorE3, f1: VectorE3, e2: VectorE3, f2: VectorE3): this {
        // FIXME: This creates a lot of temporary objects.
        // Compute the rotor that takes e1 to f1.
        // There is no concern that the two vectors are anti-parallel.
        const R1 = Geometric3.rotorFromDirections(e1, f1);
        // Compute the image of e2 under the first rotation in order to calculate R2.
        const f = Geometric3.fromVector(e2).rotate(R1);
        // In case of rotation for antipodal vectors, define the fallback rotation bivector.
        const B = Geometric3.dualOfVector(f1);
        // Compute R2
        const R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
        // The total rotor, R, is the composition of R1 followed by R2.
        return this.mul2(R2, R1);
    }

    /**
     *
     */
    rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): this {
        if (this.isLocked()) {
            throw new TargetLockedError("rotorFromFrameToFrame");
        }
        // There is instability when the rotation angle is near 180 degrees.
        // So we don't use the formula based upon reciprocal frames.
        // Our algorithm is to first pick the vector that stays most aligned with itself.
        // This allows for the possibility that the other two vectors may become anti-aligned.
        // Observe that all three vectors can't be anti-aligned because that would be a reflection!
        // We then compute the rotor R1 that maps this first vector to its image.
        // Allowing then for the possibility that the remaining vectors may have ambiguous rotors,
        // we compute the dual of this image vector as the default rotation plane for one of the
        // other vectors. We only need to calculate the rotor R2 for one more vector because our
        // frames are orthogonal and so R1 and R2 determine R.
        //
        let biggestValue = -1;
        let firstVector: number | undefined = void 0;
        for (let i = 0; i < 3; i++) {
            cosines[i] = cosVectorVector(es[i], fs[i]);
            if (cosines[i] > biggestValue) {
                firstVector = i;
                biggestValue = cosines[i];
            }
        }
        if (typeof firstVector === "number") {
            const secondVector = (firstVector + 1) % 3;
            return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
        } else {
            throw new Error("Unable to compute rotor.");
        }
    }

    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromGeneratorAngle(B: BivectorE3, θ: number): this {
        if (this.isLocked()) {
            throw new TargetLockedError("rotorFromGeneratorAngle");
        }
        const φ = θ / 2;
        const yz = B.yz;
        const zx = B.zx;
        const xy = B.xy;
        const absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
        const mφ = absB * φ;
        const sinDivAbsB = Math.sin(mφ) / absB;

        this.a = Math.cos(mφ);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = -yz * sinDivAbsB;
        this.zx = -zx * sinDivAbsB;
        this.xy = -xy * sinDivAbsB;
        this.b = 0;
        return this;
    }

    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     */
    rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3 | undefined): this {
        if (this.isLocked()) {
            throw new TargetLockedError("rotorFromVectorToVector");
        }
        rotorFromDirections(a, b, B, this);
        return this;
    }

    /**
     * Scalar Product
     * @returns scp(this, rhs) = this | rhs
     */
    scp(rhs: GeometricE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().scp(rhs));
        } else {
            return this.scp2(this, rhs);
        }
    }

    /**
     * this ⟼ scp(a, b) = a | b
     */
    scp2(a: GeometricE3, b: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("scp2");
        }
        return scpG3(a, b, this);
    }

    /**
     * this ⟼ this * alpha
     */
    scale(alpha: number): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().scale(alpha));
        } else {
            this.a *= alpha;
            this.x *= alpha;
            this.y *= alpha;
            this.z *= alpha;
            this.yz *= alpha;
            this.zx *= alpha;
            this.xy *= alpha;
            this.b *= alpha;
            return this;
        }
    }

    /**
     * Applies the diagonal elements of a scaling matrix to this multivector.
     *
     * @param σ
     */
    stress(σ: VectorE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().stress(σ));
        } else {
            this.x *= σ.x;
            this.y *= σ.y;
            this.z *= σ.z;
            // TODO: Action on other components TBD.
            return this;
        }
    }

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
    versor(a: VectorE3, b: VectorE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("versor");
        }
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const bx = b.x;
        const by = b.y;
        const bz = b.z;

        this.zero();
        this.a = dotVector(a, b);
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY(ax, ay, az, bx, by, bz);

        return this;
    }

    /**
     * @returns this - M * α
     */
    sub(M: GeometricE3, α = 1): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().sub(M, α));
        } else {
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.b -= M.b * α;
            return this;
        }
    }

    /**
     * <p>
     * <code>this ⟼ this - v * α</code>
     * </p>
     *
     * @param v
     * @param α
     * @returns this - v * α
     */
    subVector(v: VectorE3, α = 1): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().subVector(v, α));
        } else {
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        }
    }

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    sub2(a: GeometricE3, b: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("sub2");
        }
        this.a = a.a - b.a;
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.yz = a.yz - b.yz;
        this.zx = a.zx - b.zx;
        this.xy = a.xy - b.xy;
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
     * Returns a string representing the number in exponential notation.
     */
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string {
            return coord.toExponential(fractionDigits);
        };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     * Returns a string representing the number in fixed-point notation.
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string {
            return coord.toFixed(fractionDigits);
        };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     *
     */
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string {
            return coord.toPrecision(precision);
        };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     * Returns a string representation of this multivector.
     */
    toString(radix?: number): string {
        const coordToString = function (coord: number): string {
            return coord.toString(radix);
        };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    }

    /**
     * Extraction of grade <em>i</em>.
     *
     * If this multivector is mutable (unlocked) then it is set to the result.
     *
     * @param i The index of the grade to be extracted.
     */
    grade(i: number): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().grade(i));
        }
        mustBeInteger("i", i);
        switch (i) {
            case 0: {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                break;
            }
            case 1: {
                this.a = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                break;
            }
            case 2: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.b = 0;
                break;
            }
            case 3: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                break;
            }
            default: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
            }
        }
        return this;
    }

    /**
     * @returns this ^ m
     */
    ext(m: GeometricE3): Geometric3 {
        if (this.isLocked()) {
            return lock(this.clone().ext(m));
        } else {
            return this.ext2(this, m);
        }
    }

    /**
     * Sets this multivector to the outer product of `a` and `b`.
     * this ⟼ a ^ b
     */
    ext2(a: GeometricE3, b: GeometricE3): this {
        if (this.isLocked()) {
            throw new TargetLockedError("ext2");
        }
        return extG3(a, b, this);
    }

    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): this {
        if (this.isLocked()) {
            throw new TargetLockedError("zero");
        }
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        this.b = 0;
        return this;
    }

    /**
     * Implements `this + rhs` as addition.
     * The returned value is locked.
     * @hidden
     */
    __add__(rhs: number | CartesianG3): Geometric3 | undefined {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().add(duckR));
        } else if (isVectorE3(rhs)) {
            return lock(this.clone().addVector(rhs));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs + this` as addition.
     * The returned value is locked.
     * @hidden
     */
    __radd__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).add(this));
        } else if (typeof lhs === "number") {
            return lock(Geometric3.scalar(lhs).add(this));
        } else if (isVectorE3(lhs)) {
            return lock(Geometric3.fromVector(lhs).add(this));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `this / rhs` as division.
     * The returned value is locked.
     * @hidden
     */
    __div__(rhs: number | CartesianG3): Geometric3 | undefined {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().div(duckR));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs / this` as division.
     * The returned value is locked.
     * @hidden
     */
    __rdiv__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).div(this));
        } else if (typeof lhs === "number") {
            return lock(Geometric3.scalar(lhs).div(this));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `this * rhs` as the geometric product.
     * The returned value is locked.
     * @hidden
     */
    __mul__(rhs: number | CartesianG3): Geometric3 | undefined {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().mul(duckR));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs * this` as the geometric product.
     * The returned value is locked.
     * @hidden
     */
    __rmul__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).mul(this));
        } else if (typeof lhs === "number") {
            return lock(Geometric3.copy(this).scale(lhs));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `this - rhs` as subtraction.
     * The returned value is locked.
     * @hidden
     */
    __sub__(rhs: number | CartesianG3): Geometric3 | undefined {
        const duckR = maskG3(rhs);
        if (duckR) {
            return lock(this.clone().sub(duckR));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs - this` as subtraction.
     * The returned value is locked.
     * @hidden
     */
    __rsub__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).sub(this));
        } else if (typeof lhs === "number") {
            return lock(Geometric3.scalar(lhs).sub(this));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `this ^ rhs` as the extension.
     * The returned value is locked.
     * @hidden
     */
    __wedge__(rhs: number | Geometric3): Geometric3 | undefined {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).ext(rhs));
        } else if (typeof rhs === "number") {
            // The outer product with a scalar is scalar multiplication.
            return lock(Geometric3.copy(this).scale(rhs));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs ^ this` as the extension.
     * The returned value is locked.
     * @hidden
     */
    __rwedge__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).ext(this));
        } else if (typeof lhs === "number") {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return lock(Geometric3.copy(this).scale(lhs));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `this << rhs` as the left contraction.
     * The returned value is locked.
     * @hidden
     */
    __lshift__(rhs: number | Geometric3): Geometric3 | undefined {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).lco(rhs));
        } else if (typeof rhs === "number") {
            return lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs << this` as the left contraction.
     * The returned value is locked.
     * @hidden
     */
    __rlshift__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).lco(this));
        } else if (typeof lhs === "number") {
            return lock(Geometric3.scalar(lhs).lco(this));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `this >> rhs` as the right contraction.
     * The returned value is locked.
     * @hidden
     */
    __rshift__(rhs: number | Geometric3): Geometric3 | undefined {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).rco(rhs));
        } else if (typeof rhs === "number") {
            return lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs >> this` as the right contraction.
     * The returned value is locked.
     * @hidden
     */
    __rrshift__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).rco(this));
        } else if (typeof lhs === "number") {
            return lock(Geometric3.scalar(lhs).rco(this));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `this | rhs` as the scalar product.
     * The returned value is locked.
     * @hidden
     */
    __vbar__(rhs: number | Geometric3): Geometric3 | undefined {
        if (rhs instanceof Geometric3) {
            return lock(Geometric3.copy(this).scp(rhs));
        } else if (typeof rhs === "number") {
            return lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `lhs | this` as the scalar product.
     * The returned value is locked.
     * @hidden
     */
    __rvbar__(lhs: number | Geometric3): Geometric3 | undefined {
        if (lhs instanceof Geometric3) {
            return lock(Geometric3.copy(lhs).scp(this));
        } else if (typeof lhs === "number") {
            return lock(Geometric3.scalar(lhs).scp(this));
        } else {
            return void 0;
        }
    }

    /**
     * Implements `!this` as the inverse (if it exists) of `this`.
     * The returned value is locked.
     * @hidden
     */
    __bang__(): Geometric3 {
        return lock(Geometric3.copy(this).inv());
    }

    /**
     * Implements `+this` as `this`.
     * The returned value is locked.
     * @hidden
     */
    __pos__(): Geometric3 {
        return lock(Geometric3.copy(this));
    }

    /**
     * Implements `-this` as the negative of `this`.
     * The returned value is locked.
     * @hidden
     */
    __neg__(): Geometric3 {
        return lock(Geometric3.copy(this).neg());
    }

    /**
     * Implements `~this` as the reversion of `this`.
     * The returned value is locked.
     * @hidden
     */
    __tilde__(): Geometric3 {
        return lock(Geometric3.copy(this).rev());
    }

    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    public static readonly ZERO = new Geometric3(scalar(0));

    /**
     * The identity element for multiplication, `1`.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly ONE = new Geometric3(scalar(1));

    /**
     *
     */
    public static one(lock = false): Geometric3 {
        return lock ? Geometric3.ONE : Geometric3.scalar(1);
    }

    /**
     * The basis element corresponding to the vector `x` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly E1 = new Geometric3(vector(1, 0, 0));

    /**
     * Constructs the basis vector e1.
     * Locking the vector prevents mutation.
     */
    public static e1(lock = false): Geometric3 {
        return lock ? Geometric3.E1 : Geometric3.vector(1, 0, 0);
    }

    /**
     * The basis element corresponding to the vector `y` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly E2 = new Geometric3(vector(0, 1, 0));

    /**
     * Constructs the basis vector e2.
     * Locking the vector prevents mutation.
     */
    public static e2(lock = false): Geometric3 {
        return lock ? Geometric3.E2 : Geometric3.vector(0, 1, 0);
    }

    /**
     * The basis element corresponding to the vector `z` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly E3 = new Geometric3(vector(0, 0, 1));

    /**
     * Constructs the basis vector e3.
     * Locking the vector prevents mutation.
     */
    public static e3(lock = false): Geometric3 {
        return lock ? Geometric3.E3 : Geometric3.vector(0, 0, 1);
    }

    /**
     * The basis element corresponding to the pseudoscalar `b` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    public static readonly PSEUDO = new Geometric3(pseudo(1));

    /**
     *
     */
    public static I(lock = false): Geometric3 {
        return lock ? Geometric3.PSEUDO : Geometric3.pseudo(1);
    }

    /**
     * Constructs a mutable bivector with the coordinates `yz`, `zx`, and `xy`.
     */
    static bivector(yz: number, zx: number, xy: number): Geometric3 {
        return new Geometric3(bivector(yz, zx, xy));
    }

    /**
     * Constructs a mutable multivector by copying a multivector.
     */
    static copy(M: GeometricE3): Geometric3 {
        return new Geometric3(coordinates(M));
    }

    /**
     * Constructs a mutable multivector which is the dual of the bivector `B`.
     */
    static dualOfBivector(B: BivectorE3): Geometric3 {
        return new Geometric3(vector(-B.yz, -B.zx, -B.xy));
    }

    /**
     * Constructs a mutable multivector which is the dual of the vector `v`.
     */
    static dualOfVector(v: VectorE3): Geometric3 {
        return new Geometric3(bivector(v.x, v.y, v.z));
    }

    /**
     * Constructs a mutable multivector by copying the bivector `B`.
     */
    static fromBivector(B: BivectorE3): Geometric3 {
        return Geometric3.bivector(B.yz, B.zx, B.xy);
    }

    /**
     * Constructs a mutable multivector by copying the scalar `α`.
     */
    static fromScalar(α: Scalar): Geometric3 {
        return Geometric3.scalar(α.a);
    }

    /**
     * Constructs a mutable multivector by copying the spinor `s`.
     */
    static fromSpinor(s: SpinorE3): Geometric3 {
        return Geometric3.spinor(s.yz, s.zx, s.xy, s.a);
    }

    /**
     * Constructs a mutable multivector by copying the vector `v`.
     */
    static fromVector(v: VectorE3): Geometric3 {
        return Geometric3.vector(v.x, v.y, v.z);
    }

    /**
     * Constructs a mutable multivector that linearly interpolates `A` and `B`, A + α * (B - A)
     */
    static lerp(A: GeometricE3, B: GeometricE3, α: number): Geometric3 {
        return Geometric3.copy(A).lerp(B, α);
    }

    /**
     * Constructs a mutable pseudoscalar with the magnitude `β`.
     */
    static pseudo(β: number): Geometric3 {
        return new Geometric3(pseudo(β));
    }

    /**
     * Computes a multivector with random components in the range [lowerBound, upperBound].
     */
    static random(lowerBound = -1, upperBound = +1) {
        const a = randomRange(lowerBound, upperBound);
        const x = randomRange(lowerBound, upperBound);
        const y = randomRange(lowerBound, upperBound);
        const z = randomRange(lowerBound, upperBound);
        const yz = randomRange(lowerBound, upperBound);
        const zx = randomRange(lowerBound, upperBound);
        const xy = randomRange(lowerBound, upperBound);
        const b = randomRange(lowerBound, upperBound);
        return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b));
    }

    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3 {
        return new Geometric3(zero()).rotorFromDirections(a, b);
    }

    static rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): Geometric3 {
        return new Geometric3(zero()).rotorFromFrameToFrame(es, fs);
    }

    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The bivector B provides the plane of rotation when `a` and `b` are anti-aligned.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    static rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3 {
        return new Geometric3(zero()).rotorFromVectorToVector(a, b, B);
    }

    /**
     * Constructs a mutable scalar with the magnitude `α`.
     */
    static scalar(α: number): Geometric3 {
        return new Geometric3(scalar(α));
    }

    /**
     * Constructs a mutable scalar with the coordinates `yz`, `zx`, `xy`, and `α`.
     */
    static spinor(yz: number, zx: number, xy: number, α: number): Geometric3 {
        return new Geometric3(spinor(α, yz, zx, xy));
    }

    /**
     * Constructs a mutable vector with the coordinates `x`, `y`, and `z`.
     */
    static vector(x: number, y: number, z: number): Geometric3 {
        return new Geometric3(vector(x, y, z));
    }

    /**
     * Constructs a mutable bivector as the outer product of two vectors.
     */
    static wedge(a: VectorE3, b: VectorE3): Geometric3 {
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const bx = b.x;
        const by = b.y;
        const bz = b.z;

        const yz = wedgeYZ(ax, ay, az, bx, by, bz);
        const zx = wedgeZX(ax, ay, az, bx, by, bz);
        const xy = wedgeXY(ax, ay, az, bx, by, bz);

        return Geometric3.bivector(yz, zx, xy);
    }

    /**
     *
     */
    public static zero(lock = false): Geometric3 {
        return lock ? Geometric3.ZERO : new Geometric3(zero());
    }
}
Geometric3.E1.lock();
Geometric3.E2.lock();
Geometric3.E3.lock();
Geometric3.PSEUDO.lock();
Geometric3.ONE.lock();
Geometric3.ZERO.lock();
