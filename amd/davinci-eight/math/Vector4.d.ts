import Cartesian4 = require('../math/Cartesian4');
import LinearElement = require('../math/LinearElement');
import AbstractVector = require('../math/AbstractVector');
/**
 * @class Vector4
 */
declare class Vector4 extends AbstractVector implements Cartesian4, LinearElement<Cartesian4, Vector4> {
    /**
     * @class Vector4
     * @constructor
     * @param data {number[]}
     */
    constructor(data?: number[]);
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
    clone(): Vector4;
    copy(v: Cartesian4): Vector4;
    divideScalar(scalar: number): Vector4;
    multiplyScalar(scalar: number): Vector4;
}
export = Vector4;
