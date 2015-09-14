import Cartesian3 = require('../math/Cartesian3');
import GeometricElement = require('../math/GeometricElement');
import Matrix4 = require('../math/Matrix4');
import Vector3 = require('../math/Vector3');
/**
 * Quaternion is retained for reference only.
 * Quaternion should not be exposed.
 */
declare class Quaternion implements GeometricElement<Quaternion, Quaternion> {
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
    add(element: Quaternion): Quaternion;
    sum(a: Quaternion, b: Quaternion): Quaternion;
    set(x: number, y: number, z: number, w: number): Quaternion;
    clone(): Quaternion;
    conjugate(): Quaternion;
    copy(quaternion: Quaternion): Quaternion;
    divideScalar(scalar: number): Quaternion;
    dot(v: Quaternion): number;
    exp(): Quaternion;
    inverse(): Quaternion;
    lerp(target: Quaternion, alpha: number): Quaternion;
    magnitude(): number;
    multiply(q: Quaternion): Quaternion;
    product(a: Quaternion, b: Quaternion): Quaternion;
    multiplyScalar(scalar: number): Quaternion;
    normalize(): Quaternion;
    onChange(callback: () => void): Quaternion;
    quaditude(): number;
    rotate(rotor: Quaternion): Quaternion;
    setFromAxisAngle(axis: Cartesian3, angle: number): Quaternion;
    setFromRotationMatrix(m: Matrix4): Quaternion;
    setFromUnitVectors(vFrom: Vector3, vTo: Vector3): Quaternion;
    slerp(qb: Quaternion, t: number): Quaternion;
    sub(rhs: Quaternion): Quaternion;
    difference(a: Quaternion, b: Quaternion): Quaternion;
    equals(quaternion: Quaternion): boolean;
    fromArray(array: number[], offset?: number): Quaternion;
    toArray(array?: number[], offset?: number): number[];
    static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;
}
export = Quaternion;
