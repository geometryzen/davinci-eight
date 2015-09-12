import Vertex = require('../dfx/Vertex');
import VectorN = require('../math/VectorN');
declare class Simplex {
    vertices: Vertex[];
    /**
     * @class Simplex
     * @constructor
     * @param points {VectorN<number>[]}
     */
    constructor(points: VectorN<number>[]);
    static indices(simplex: Simplex): number[];
    private static subdivideOne(simplex);
    static subdivide(faces: Simplex[]): Simplex[];
}
export = Simplex;
