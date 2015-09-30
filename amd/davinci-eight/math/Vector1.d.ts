import Cartesian1 = require('../math/Cartesian1');
import LinearElement = require('../math/LinearElement');
import Spinor1Coords = require('../math/Spinor1Coords');
import VectorN = require('../math/VectorN');
/**
 * @class Vector1
 */
declare class Vector1 extends VectorN<number> implements Cartesian1, LinearElement<Cartesian1, Vector1, Spinor1Coords, Cartesian1> {
    /**
     * @class Vector1
     * @constructor
     * @param data {number[]} Default is [0].
     * @param modified {boolean} Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    set(x: number): Vector1;
    setX(x: number): Vector1;
    copy(v: Cartesian1): Vector1;
    add(v: Cartesian1): Vector1;
    addScalar(s: number): Vector1;
    sum(a: Cartesian1, b: Cartesian1): Vector1;
    exp(): Vector1;
    sub(v: Cartesian1): Vector1;
    subScalar(s: number): Vector1;
    difference(a: Cartesian1, b: Cartesian1): Vector1;
    multiply(v: Cartesian1): Vector1;
    scale(scalar: number): Vector1;
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
    reflect(n: Cartesian1): Vector1;
    rotate(rotor: Spinor1Coords): Vector1;
    setMagnitude(l: number): Vector1;
    lerp(v: Cartesian1, alpha: number): Vector1;
    lerpVectors(v1: Vector1, v2: Vector1, alpha: number): Vector1;
    equals(v: Cartesian1): boolean;
    fromArray(array: number[], offset?: number): Vector1;
    toArray(array?: number[], offset?: number): number[];
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): Vector1;
    clone(): Vector1;
}
export = Vector1;
