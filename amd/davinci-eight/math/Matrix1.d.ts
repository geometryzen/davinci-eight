import AbstractMatrix = require('../math/AbstractMatrix');
import Cartesian1 = require('../math/Cartesian1');
import GeometricElement = require('../math/GeometricElement');
import Matrix = require('../math/Matrix');
declare class Matrix1 extends AbstractMatrix implements Matrix<Matrix1>, GeometricElement<Matrix1, Matrix1, Matrix1, Cartesian1> {
    /**
     * Constructs a Matrix1 by wrapping a Float32Array.
     * @constructor
     */
    constructor(data: Float32Array);
    static identity(): Matrix1;
    add(element: Matrix1): Matrix1;
    sum(a: Matrix1, b: Matrix1): Matrix1;
    clone(): Matrix1;
    copy(m: Matrix1): Matrix1;
    determinant(): number;
    divideScalar(scalar: number): Matrix1;
    exp(): Matrix1;
    identity(): Matrix1;
    lerp(target: Matrix1, alpha: number): Matrix1;
    log(): Matrix1;
    magnitude(): number;
    multiply(rhs: Matrix1): Matrix1;
    scale(scalar: number): Matrix1;
    product(a: Matrix1, b: Matrix1): Matrix1;
    quaditude(): number;
    reflect(n: Cartesian1): Matrix1;
    rotate(rotor: Matrix1): Matrix1;
    sub(element: Matrix1): Matrix1;
    difference(a: Matrix1, b: Matrix1): Matrix1;
    rotor(b: Cartesian1, a: Cartesian1): Matrix1;
    spinor(a: Cartesian1, b: Cartesian1): Matrix1;
}
export = Matrix1;
