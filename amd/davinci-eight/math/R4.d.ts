import VectorE4 = require('../math/VectorE4');
import MutableLinearElement = require('../math/MutableLinearElement');
import SpinorE4 = require('../math/SpinorE4');
import VectorN = require('../math/VectorN');
/**
 * @class R4
 */
declare class R4 extends VectorN<number> implements VectorE4, MutableLinearElement<VectorE4, R4, SpinorE4, VectorE4> {
    /**
     * @class R4
     * @constructor
     * @param data {number[]} Default is [0, 0, 0, 0].
     * @param modified {boolean} Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    setX(x: number): R4;
    /**
     * @property y
     * @type Number
     */
    y: number;
    setY(y: number): R4;
    /**
     * @property z
     * @type Number
     */
    z: number;
    setZ(z: number): R4;
    /**
     * @property w
     * @type Number
     */
    w: number;
    setW(w: number): R4;
    add(vector: VectorE4, α?: number): R4;
    add2(a: VectorE4, b: VectorE4): R4;
    clone(): R4;
    copy(v: VectorE4): R4;
    divByScalar(α: number): R4;
    lerp(target: VectorE4, α: number): R4;
    lerp2(a: VectorE4, b: VectorE4, α: number): R4;
    neg(): R4;
    scale(α: number): R4;
    reflect(n: VectorE4): R4;
    rotate(rotor: SpinorE4): R4;
    slerp(target: VectorE4, α: number): R4;
    sub(v: VectorE4, α: number): R4;
    sub2(a: VectorE4, b: VectorE4): R4;
    toExponential(): string;
    toFixed(digits?: number): string;
    zero(): R4;
}
export = R4;
