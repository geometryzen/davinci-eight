import AbstractMatrix = require('../math/AbstractMatrix');
declare class Matrix1 extends AbstractMatrix {
    /**
     * Constructs a Matrix1 by wrapping a Float32Array.
     * @constructor
     */
    constructor(data: Float32Array);
}
export = Matrix1;
