import Vertex = require('../dfx/Vertex');
import VectorN = require('../math/VectorN');
declare class Simplex {
    vertices: Vertex[];
    /**
     * @class Simplex
     * @constructor
     * @param k {number} The initial number of vertices in the simplex.
     */
    constructor(k: number);
    static indices(simplex: Simplex): number[];
    private static subdivideOne(simplex);
    static subdivide(faces: Simplex[]): Simplex[];
    static setAttributeValues(attributes: {
        [name: string]: VectorN<number>[];
    }, simplex: Simplex): void;
}
export = Simplex;
