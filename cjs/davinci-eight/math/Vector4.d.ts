import Cartesian4 = require('../math/Cartesian4');
import LinearElement = require('../math/LinearElement');
import VectorN = require('../math/VectorN');
/**
 * @class Vector4
 */
declare class Vector4 extends VectorN<number> implements Cartesian4, LinearElement<Cartesian4, Vector4> {
    /**
     * @class Vector4
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
    setX(x: number): Vector4;
    /**
     * @property y
     * @type Number
     */
    y: number;
    setY(y: number): Vector4;
    /**
     * @property z
     * @type Number
     */
    z: number;
    setZ(z: number): Vector4;
    /**
     * @property w
     * @type Number
     */
    w: number;
    setW(w: number): Vector4;
    add(rhs: Cartesian4): Vector4;
    addVectors(a: Cartesian4, b: Cartesian4): Vector4;
    clone(): Vector4;
    copy(v: Cartesian4): Vector4;
    divideScalar(scalar: number): Vector4;
    multiplyScalar(scalar: number): Vector4;
    sub(rhs: Cartesian4): Vector4;
}
export = Vector4;
