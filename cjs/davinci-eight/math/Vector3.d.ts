import Cartesian3 = require('../math/Cartesian3');
import Matrix4 = require('../math/Matrix4');
import Spinor3 = require('../math/Spinor3');
import Mutable = require('../math/Mutable');
/**
 * @class Vector3
 */
declare class Vector3 implements Cartesian3, Mutable<number[]> {
    private $data;
    private $callback;
    modified: boolean;
    static e1: Vector3;
    static e2: Vector3;
    static e3: Vector3;
    /**
     * @class Vector3
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
    /**
     * @property y
     * @type Number
     */
    y: number;
    /**
     * @property z
     * @type Number
     */
    z: number;
    /**
     * Performs in-place addition of vectors.
     *
     * @method add
     * @param v {Vector3} The vector to add to this vector.
     */
    add(v: Cartesian3): Vector3;
    applyMatrix4(m: Matrix4): Vector3;
    applyQuaternion(q: {
        x: number;
        y: number;
        z: number;
        w: number;
    }): Vector3;
    applySpinor(spinor: Spinor3): Vector3;
    clone(): Vector3;
    copy(v: Cartesian3): Vector3;
    cross(v: Cartesian3): Vector3;
    crossVectors(a: Cartesian3, b: Cartesian3): Vector3;
    distance(v: Cartesian3): number;
    quadrance(v: Cartesian3): number;
    divideScalar(scalar: number): Vector3;
    dot(v: Cartesian3): number;
    length(): number;
    lerp(v: Cartesian3, alpha: number): Vector3;
    normalize(): Vector3;
    multiply(v: Cartesian3): Vector3;
    multiplyScalar(scalar: number): Vector3;
    set(x: number, y: number, z: number): Vector3;
    setX(x: number): Vector3;
    setY(y: number): Vector3;
    setZ(z: number): Vector3;
    sub(v: Cartesian3): Vector3;
    subVectors(a: Cartesian3, b: Cartesian3): Vector3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    /**
     * @method copy
     * Copy constructor.
     */
    static copy(vector: Cartesian3): Vector3;
}
export = Vector3;
