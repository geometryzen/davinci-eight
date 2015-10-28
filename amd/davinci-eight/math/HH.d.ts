import MutableGeometricElement3D = require('../math/MutableGeometricElement3D');
import Matrix4 = require('../math/Matrix4');
import TrigMethods = require('../math/TrigMethods');
import VectorE3 = require('../math/VectorE3');
declare class HH implements MutableGeometricElement3D<HH, HH, HH, VectorE3>, TrigMethods<HH> {
    private x;
    private y;
    private z;
    t: number;
    constructor(t?: number, v?: VectorE3);
    v: VectorE3;
    add(q: HH, α?: number): HH;
    /**
     * Intentionally undocumented.
     */
    addPseudo(β: number): HH;
    addScalar(α: number): HH;
    add2(a: HH, b: HH): HH;
    adj(): HH;
    arg(): number;
    dual(vector: VectorE3): HH;
    clone(): HH;
    lco(rhs: HH): HH;
    lco2(a: HH, b: HH): HH;
    rco(rhs: HH): HH;
    rco2(a: HH, b: HH): HH;
    conj(): HH;
    copy(quaternion: HH): HH;
    copyScalar(α: number): HH;
    copySpinor(spinor: HH): HH;
    copyVector(vector: VectorE3): HH;
    cos(): HH;
    cosh(): HH;
    div(q: HH): HH;
    div2(a: HH, b: HH): HH;
    divByScalar(scalar: number): HH;
    dot(v: HH): number;
    exp(): HH;
    inv(): HH;
    lerp(target: HH, α: number): HH;
    lerp2(a: HH, b: HH, α: number): HH;
    log(): HH;
    magnitude(): number;
    mul(q: HH): HH;
    mul2(a: HH, b: HH): HH;
    norm(): HH;
    scale(α: number): HH;
    sin(): HH;
    sinh(): HH;
    neg(): HH;
    normalize(): HH;
    quad(): HH;
    squaredNorm(): number;
    reflect(n: VectorE3): HH;
    rev(): HH;
    rotate(rotor: HH): HH;
    rotorFromDirections(a: VectorE3, b: VectorE3): HH;
    rotorFromAxisAngle(axis: VectorE3, θ: number): HH;
    rotorFromGeneratorAngle(B: HH, θ: number): HH;
    setFromRotationMatrix(m: Matrix4): HH;
    spinor(a: VectorE3, b: VectorE3): HH;
    slerp(qb: HH, t: number): HH;
    scp(rhs: HH): HH;
    scp2(a: HH, b: HH): HH;
    sub(q: HH, α?: number): HH;
    sub2(a: HH, b: HH): HH;
    toExponential(): string;
    toFixed(digits?: number): string;
    equals(quaternion: HH): boolean;
    fromArray(array: number[], offset?: number): HH;
    toArray(array?: number[], offset?: number): number[];
    ext(rhs: HH): HH;
    ext2(a: HH, b: HH): HH;
    /**
     * Sets this quaternion to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {HH}
     * @chainable
     */
    zero(): HH;
    static slerp(qa: HH, qb: HH, qm: HH, t: number): HH;
}
export = HH;
