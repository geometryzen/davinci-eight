import Cartesian4 = require('../math/Cartesian4');
import AbstractVector = require('../math/AbstractVector');
/**
 * @class Vector4
 */
declare class Vector4 extends AbstractVector implements Cartesian4 {
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
}
export = Vector4;
