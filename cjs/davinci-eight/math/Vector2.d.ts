import Cartesian2 = require('../math/Cartesian2');
import LinearElement = require('../math/LinearElement');
import VectorN = require('../math/VectorN');
/**
 * @class Vector2
 */
declare class Vector2 extends VectorN<number> implements Cartesian2, LinearElement<Cartesian2, Vector2> {
    /**
     * @class Vector2
     * @constructor
     * @param data {number[]} Default is [0, 0].
     * @param modified {boolean} Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    /**
     * @property y
     * @type Number
     */
    y: number;
    set(x: number, y: number): Vector2;
    setX(x: number): Vector2;
    setY(y: number): Vector2;
    copy(v: Cartesian2): Vector2;
    add(v: Cartesian2): Vector2;
    addScalar(s: number): Vector2;
    addVectors(a: Cartesian2, b: Cartesian2): Vector2;
    sub(v: Cartesian2): Vector2;
    subScalar(s: number): Vector2;
    subVectors(a: Cartesian2, b: Cartesian2): Vector2;
    multiply(v: Cartesian2): Vector2;
    multiplyScalar(s: number): Vector2;
    divide(v: Cartesian2): Vector2;
    divideScalar(scalar: number): Vector2;
    min(v: Cartesian2): Vector2;
    max(v: Cartesian2): Vector2;
    floor(): Vector2;
    ceil(): Vector2;
    round(): Vector2;
    roundToZero(): Vector2;
    negate(): Vector2;
    distanceTo(position: Cartesian2): number;
    dot(v: Cartesian2): number;
    magnitude(): number;
    normalize(): Vector2;
    quaditude(): number;
    quadranceTo(position: Cartesian2): number;
    setMagnitude(l: number): Vector2;
    lerp(v: Cartesian2, alpha: number): Vector2;
    lerpVectors(v1: Vector2, v2: Vector2, alpha: number): Vector2;
    equals(v: Cartesian2): boolean;
    fromArray(array: number[], offset?: number): Vector2;
    toArray(array?: number[], offset?: number): number[];
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): Vector2;
    clone(): Vector2;
}
export = Vector2;
