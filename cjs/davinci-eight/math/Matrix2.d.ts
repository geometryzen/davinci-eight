import AbstractMatrix = require('../math/AbstractMatrix');
declare class Matrix2 extends AbstractMatrix {
    /**
     * Constructs a Matrix2 by wrapping a Float32Array.
     * @constructor
     */
    constructor(data: Float32Array);
}
export = Matrix2;
