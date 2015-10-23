import VectorE4 = require('../math/VectorE4');
import LinearElement = require('../math/LinearElement');
import SpinorE4 = require('../math/SpinorE4');
import VectorN = require('../math/VectorN');
/**
 * @class MutableVectorE4
 */
declare class MutableVectorE4 extends VectorN<number> implements VectorE4, LinearElement<VectorE4, MutableVectorE4, SpinorE4, VectorE4> {
    /**
     * @class MutableVectorE4
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
    setX(x: number): MutableVectorE4;
    /**
     * @property y
     * @type Number
     */
    y: number;
    setY(y: number): MutableVectorE4;
    /**
     * @property z
     * @type Number
     */
    z: number;
    setZ(z: number): MutableVectorE4;
    /**
     * @property w
     * @type Number
     */
    w: number;
    setW(w: number): MutableVectorE4;
    add(vector: VectorE4, α?: number): MutableVectorE4;
    add2(a: VectorE4, b: VectorE4): MutableVectorE4;
    clone(): MutableVectorE4;
    copy(v: VectorE4): MutableVectorE4;
    divideByScalar(α: number): MutableVectorE4;
    lerp(target: VectorE4, α: number): MutableVectorE4;
    lerp2(a: VectorE4, b: VectorE4, α: number): MutableVectorE4;
    scale(α: number): MutableVectorE4;
    reflect(n: VectorE4): MutableVectorE4;
    rotate(rotor: SpinorE4): MutableVectorE4;
    sub(v: VectorE4, α: number): MutableVectorE4;
    sub2(a: VectorE4, b: VectorE4): MutableVectorE4;
}
export = MutableVectorE4;
