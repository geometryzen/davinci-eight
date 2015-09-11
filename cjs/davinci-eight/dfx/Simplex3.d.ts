import Simplex3Vertex = require('../dfx/Simplex3Vertex');
import Vector3 = require('../math/Vector3');
declare class Simplex3 {
    a: Simplex3Vertex;
    b: Simplex3Vertex;
    c: Simplex3Vertex;
    private _normal;
    /**
     * @class Simplex3
     * @constructor
     * @param a {Simplex3Vertex}
     * @param b {Simplex3Vertex}
     * @param c {Simplex3Vertex}
     */
    constructor(a: Vector3, b: Vector3, c: Vector3);
    normal: Vector3;
    static indices(face: Simplex3): number[];
    private static subdivideOne(face);
    static subdivide(faces: Simplex3[]): Simplex3[];
}
export = Simplex3;
