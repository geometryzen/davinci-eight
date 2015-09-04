import Cartesian1 = require('../math/Cartesian1');
import Mutable = require('../math/Mutable');
/**
 * @class Vector1
 */
declare class Vector1 implements Cartesian1, Mutable<number[]> {
    private $data;
    private $callback;
    modified: boolean;
    /**
     * @class Vector1
     * @constructor
     * @param data {number[]}
     */
    constructor(data?: number[]);
    data: number[];
    callback: () => number[];
    /**
     * @property x
     * @type Number
     */
    x: number;
    set(x: number): Vector1;
    setX(x: number): Vector1;
    setComponent(index: number, value: number): void;
    getComponent(index: number): number;
    copy(v: Cartesian1): Vector1;
    add(v: Cartesian1): Vector1;
    addScalar(s: number): Vector1;
    addVectors(a: Cartesian1, b: Cartesian1): Vector1;
    sub(v: Cartesian1): Vector1;
    subScalar(s: number): Vector1;
    subVectors(a: Cartesian1, b: Cartesian1): Vector1;
    multiply(v: Cartesian1): Vector1;
    multiplyScalar(s: number): Vector1;
    divide(v: Cartesian1): Vector1;
    divideScalar(scalar: number): Vector1;
    min(v: Cartesian1): Vector1;
    max(v: Cartesian1): Vector1;
    floor(): Vector1;
    ceil(): Vector1;
    round(): Vector1;
    roundToZero(): Vector1;
    negate(): Vector1;
    distanceTo(position: Cartesian1): number;
    dot(v: Cartesian1): number;
    magnitude(): number;
    normalize(): Vector1;
    quaditude(): number;
    quadranceTo(position: Cartesian1): number;
    setMagnitude(l: number): Vector1;
    lerp(v: Cartesian1, alpha: number): Vector1;
    lerpVectors(v1: Vector1, v2: Vector1, alpha: number): Vector1;
    equals(v: Cartesian1): boolean;
    fromArray(array: number[], offset: number): Vector1;
    toArray(array: number[], offset: number): number[];
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset: number): Vector1;
    clone(): Vector1;
}
export = Vector1;
