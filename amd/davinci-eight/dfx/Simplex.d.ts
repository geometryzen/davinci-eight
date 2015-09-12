import Vertex = require('../dfx/Vertex');
import Vector3 = require('../math/Vector3');
declare class Simplex {
    vertices: Vertex[];
    /**
     * @class Simplex
     * @constructor
     * @param points {Vector3[]}
     */
    constructor(points: Vector3[]);
    static computeFaceNormals(simplex: Simplex): void;
    static indices(simplex: Simplex): number[];
    private static subdivideOne(simplex);
    static subdivide(faces: Simplex[]): Simplex[];
}
export = Simplex;
