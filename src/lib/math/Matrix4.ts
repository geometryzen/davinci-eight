import { lock, TargetLockedError } from '../core/Lockable';
import { perspectiveArray } from '../facets/perspectiveArray';
import { AbstractMatrix } from '../math/AbstractMatrix';
import { inv4x4 } from '../math/inv4x4';
import { mul4x4 } from '../math/mul4x4';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
import { det4x4 } from './det4x4';

/**
 * @hidden
 */
function add4x4(a: Float32Array, b: Float32Array, c: Float32Array): void {

    const a11 = a[0x0], a12 = a[0x4], a13 = a[0x8], a14 = a[0xC];
    const a21 = a[0x1], a22 = a[0x5], a23 = a[0x9], a24 = a[0xD];
    const a31 = a[0x2], a32 = a[0x6], a33 = a[0xA], a34 = a[0xE];
    const a41 = a[0x3], a42 = a[0x7], a43 = a[0xB], a44 = a[0xF];

    const b11 = b[0x0], b12 = b[0x4], b13 = b[0x8], b14 = b[0xC];
    const b21 = b[0x1], b22 = b[0x5], b23 = b[0x9], b24 = b[0xD];
    const b31 = b[0x2], b32 = b[0x6], b33 = b[0xA], b34 = b[0xE];
    const b41 = b[0x3], b42 = b[0x7], b43 = b[0xB], b44 = b[0xF];

    c[0x0] = a11 + b11;
    c[0x4] = a12 + b12;
    c[0x8] = a13 + b13;
    c[0xC] = a14 + b14;

    c[0x1] = a21 + b21;
    c[0x5] = a22 + b22;
    c[0x9] = a23 + b23;
    c[0xD] = a24 + b24;

    c[0x2] = a31 + b31;
    c[0x6] = a32 + b32;
    c[0xA] = a33 + b33;
    c[0xE] = a34 + b34;

    c[0x3] = a41 + b41;
    c[0x7] = a42 + b42;
    c[0xB] = a43 + b43;
    c[0xF] = a44 + b44;
}

/**
 * A 4x4 (square) matrix of numbers.
 *
 * An adapter for a `Float32Array`.
 * @hidden
 */
export class Matrix4 extends AbstractMatrix<Matrix4> {

    // The correspondence between the elements property index and the matrix entries is...
    //
    //  0  4  8 12
    //  1  5  9 13
    //  2  6 10 14
    //  3  7 11 15
    /**
     * 
     */
    constructor(elements: Float32Array) {
        super(elements, 4);
    }

    /**
     * The identity matrix for multiplication, 1.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly one = lock(new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));

    /**
     * The identity matrix for addition, 0.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly zero = lock(new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])));

    /**
     * Constructs a 4x4 matrix that performs the scaling specified by the vector.
     */
    public static scaling(scale: VectorE3): Matrix4 {
        return Matrix4.one.clone().scaling(scale);
    }

    /**
     * Constructs a 4x4 matrix that performs the translation specified by the vector.
     */
    public static translation(vector: VectorE3): Matrix4 {
        return Matrix4.one.clone().translation(vector);
    }

    /**
     * Constructs a 4x4 matrix that performs the rotation specified by the spinor.
     */
    public static rotation(spinor: SpinorE3): Matrix4 {
        return Matrix4.one.clone().rotation(spinor);
    }

    /**
     * Sets this matrix to `this + rhs`.
     */
    add(rhs: Matrix4): this {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
        return this.add2(this, rhs);
    }

    /**
     * Sets this matrix to `a + b`.
     */
    add2(a: Matrix4, b: Matrix4): this {
        add4x4(a.elements, b.elements, this.elements);
        return this;
    }

    /**
     * Returns a copy of this Matrix4 instance.
     */
    clone(): Matrix4 {
        return new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).copy(this);
    }

    /**
     * Sets this matrix to perform the specified scaling, rotation, and translation.
     */
    compose(S: VectorE3, R: SpinorE3, T: VectorE3): this {
        this.scaling(S);
        this.rotate(R);
        this.translate(T);
        return this;
    }

    /**
     * Copies the specified matrix into this matrix.
     */
    copy(m: Matrix4): this {
        this.elements.set(m.elements);
        return this;
    }

    /**
     * Computes the determinant.
     */
    det(): number {
        return det4x4(this.elements);
    }

    /**
     * Sets the elements of this matrix to that of its inverse.
     */
    inv(): this {
        inv4x4(this.elements, this.elements);
        return this;
    }

    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     */
    one(): this {
        return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    /**
     * Multiplies all elements of this matrix by the specified value.
     */
    scale(s: number): this {
        const te = this.elements;
        te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
        te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
        te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
        te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;
        return this;
    }

    /**
     * Sets this matrix to its transpose.
     */
    transpose(): this {
        const te: Float32Array = this.elements;
        let tmp: number;

        tmp = te[1]; te[1] = te[4]; te[4] = tmp;
        tmp = te[2]; te[2] = te[8]; te[8] = tmp;
        tmp = te[6]; te[6] = te[9]; te[9] = tmp;

        tmp = te[3]; te[3] = te[12]; te[12] = tmp;
        tmp = te[7]; te[7] = te[13]; te[13] = tmp;
        tmp = te[11]; te[11] = te[14]; te[14] = tmp;

        return this;
    }

    /**
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
        let te = this.elements;
        let x = 2 * near / (right - left);
        let y = 2 * near / (top - bottom);

        let a = (right + left) / (right - left);
        let b = (top + bottom) / (top - bottom);
        let c = - (far + near) / (far - near);
        let d = - 2 * far * near / (far - near);

        te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
        te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
        te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
        te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;

        return this;
    }

    /**
     * Sets this matrix to the viewing transformation.
     * This is the matrix that may be applied to points in the truncated viewing pyramid.
     * The resulting points then lie in the image space (cube).
     */
    perspective(fov: number, aspect: number, near: number, far: number): this {
        perspectiveArray(fov, aspect, near, far, this.elements);
        return this;
    }

    /**
     * @param axis
     * @param angle
     */
    rotationAxis(axis: VectorE3, angle: number): this {

        // Based on http://www.gamedev.net/reference/articles/article1199.asp

        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const x = axis.x, y = axis.y, z = axis.z;
        const tx = t * x, ty = t * y;

        return this.set(
            tx * x + c, tx * y - s * z, tx * z + s * y, 0,
            tx * y + s * z, ty * y + c, ty * z - s * x, 0,
            tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
            0, 0, 0, 1
        );
    }

    /**
     *
     */
    mul(rhs: Matrix4): this {
        return this.mul2(this, rhs);
    }

    /**
     *
     */
    mul2(a: Matrix4, b: Matrix4): this {
        mul4x4(a.elements, b.elements, this.elements);
        return this;
    }

    /**
     *
     */
    rmul(lhs: Matrix4): this {
        return this.mul2(lhs, this);
    }

    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(n)
     *
     * @param n
     */
    reflection(n: VectorE3): this {
        const nx = n.x;
        const ny = n.y;
        const nz = n.z;

        const aa = -2 * nx * ny;
        const cc = -2 * ny * nz;
        const bb = -2 * nz * nx;

        const xx = 1 - 2 * nx * nx;
        const yy = 1 - 2 * ny * ny;
        const zz = 1 - 2 * nz * nz;

        this.set(
            xx, aa, bb, 0,
            aa, yy, cc, 0,
            bb, cc, zz, 0,
            0, 0, 0, 1
        );
        return this;
    }

    /**
     * this ⟼ rotation(spinor) * this
     *
     * @param spinor
     */
    rotate(spinor: SpinorE3): this {
        return this.rmul(Matrix4.rotation(spinor));
    }

    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotation(spinor: SpinorE3): this {
        // The correspondence between quaternions and spinors is
        // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
        const x: number = -spinor.yz;
        const y: number = -spinor.zx;
        const z: number = -spinor.xy;
        const α: number = spinor.a;

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = α * x2;
        const wy = α * y2;
        const wz = α * z2;

        this.set(
            1 - yy - zz, xy - wz, xz + wy, 0,
            xy + wz, 1 - xx - zz, yz - wx, 0,
            xz - wy, yz + wx, 1 - xx - yy, 0,
            0, 0, 0, 1
        );

        return this;
    }

    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): Array<number> {
        let te = this.elements;
        return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
    }

    /**
     *
     */
    scaleXYZ(scale: VectorE3): this {
        // We treat the scale operation as pre-multiplication: 
        // |x 0 0 0|   |m[0] m[4] m[8] m[C]|   |x * m[0] x * m[4] x * m[8] x * m[C]|
        // |0 y 0 0| * |m[1] m[5] m[9] m[D]| = |y * m[1] y * m[5] y * m[9] y * m[D]|
        // |0 0 z 0|   |m[2] m[6] m[A] m[E]|   |z * m[2] z * m[6] z * m[A] z * m[E]|
        // |0 0 0 1|   |m[3] m[7] m[B] m[F]|   |    m[3]     m[7]     m[B]     m[F]|

        // The following would be post-multiplication:
        // |m[0] m[4] m[8] m[C]|   |x 0 0 0|   |x * m[0] y * m[4] z * m[8]     m[C]|
        // |m[1] m[5] m[9] m[D]| * |0 y 0 0| = |x * m[1] y * m[5] z * m[9]     m[D]|
        // |m[2] m[6] m[A] m[E]|   |0 0 z 0|   |x * m[2] y * m[6] z * m[A]     m[E]|
        // |m[3] m[7] m[B] m[F]|   |0 0 0 1|   |x * m[3] y * m[7] z * m[B]     m[F]|
        return this.rmul(Matrix4.scaling(scale));
    }

    /**
     *
     */
    scaling(scale: VectorE3): this {
        return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
    }

    /**
     *
     */
    public set(
        n11: number,
        n12: number,
        n13: number,
        n14: number,
        n21: number,
        n22: number,
        n23: number,
        n24: number,
        n31: number,
        n32: number,
        n33: number,
        n34: number,
        n41: number,
        n42: number,
        n43: number,
        n44: number): this {

        const te = this.elements;

        te[0x0] = n11; te[0x4] = n12; te[0x8] = n13; te[0xC] = n14;
        te[0x1] = n21; te[0x5] = n22; te[0x9] = n23; te[0xD] = n24;
        te[0x2] = n31; te[0x6] = n32; te[0xA] = n33; te[0xE] = n34;
        te[0x3] = n41; te[0x7] = n42; te[0xB] = n43; te[0xF] = n44;

        return this;
    }

    /**
     *
     */
    toExponential(fractionDigits?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     *
     */
    toFixed(fractionDigits?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     *
     */
    toPrecision(fractionDigits?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toPrecision(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     *
     */
    toString(radix?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * this ⟼ translation(spinor) * this
     */
    translate(d: VectorE3): this {
        return this.rmul(Matrix4.translation(d));
    }

    /**
     * Sets this matrix to be equivalent to the displacement vector argument.
     */
    translation(displacement: VectorE3): this {
        const x = displacement.x;
        const y = displacement.y;
        const z = displacement.z;
        return this.set(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1);
    }

    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    zero(): this {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    public __mul__(rhs: Matrix4 | number): Matrix4 {
        if (rhs instanceof Matrix4) {
            return lock(Matrix4.one.clone().mul2(this, rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    }

    public __rmul__(lhs: Matrix4 | number): Matrix4 {
        if (lhs instanceof Matrix4) {
            return lock(Matrix4.one.clone().mul2(lhs, this));
        }
        else if (typeof lhs === 'number') {
            return lock(this.clone().scale(lhs));
        }
        else {
            return void 0;
        }
    }
}
