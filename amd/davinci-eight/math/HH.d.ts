import Cartesian3 = require('../math/Cartesian3');
import GeometricElement = require('../math/GeometricElement');
import Matrix4 = require('../math/Matrix4');
import Vector3 = require('../math/Vector3');
/**
 * HH is retained for reference only.
 * HH should not be exposed.
 */
declare class HH implements GeometricElement<HH, HH> {
    private _x;
    private _y;
    private _z;
    private _w;
    onChangeCallback: () => void;
    constructor(x?: number, y?: number, z?: number, w?: number);
    x: number;
    y: number;
    z: number;
    w: number;
    add(element: HH): HH;
    sum(a: HH, b: HH): HH;
    set(x: number, y: number, z: number, w: number): HH;
    clone(): HH;
    conjugate(): HH;
    copy(quaternion: HH): HH;
    divideScalar(scalar: number): HH;
    dot(v: HH): number;
    exp(): HH;
    inverse(): HH;
    lerp(target: HH, alpha: number): HH;
    magnitude(): number;
    multiply(q: HH): HH;
    product(a: HH, b: HH): HH;
    multiplyScalar(scalar: number): HH;
    normalize(): HH;
    onChange(callback: () => void): HH;
    quaditude(): number;
    rotate(rotor: HH): HH;
    setFromAxisAngle(axis: Cartesian3, angle: number): HH;
    setFromRotationMatrix(m: Matrix4): HH;
    setFromUnitVectors(vFrom: Vector3, vTo: Vector3): HH;
    slerp(qb: HH, t: number): HH;
    sub(rhs: HH): HH;
    difference(a: HH, b: HH): HH;
    equals(quaternion: HH): boolean;
    fromArray(array: number[], offset?: number): HH;
    toArray(array?: number[], offset?: number): number[];
    static slerp(qa: HH, qb: HH, qm: HH, t: number): HH;
}
export = HH;
