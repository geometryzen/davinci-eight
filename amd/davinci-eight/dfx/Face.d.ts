import FaceVertex = require('../dfx/FaceVertex');
import Vector3 = require('../math/Vector3');
declare class Face {
    a: FaceVertex;
    b: FaceVertex;
    c: FaceVertex;
    private _normal;
    /**
     * @class Face
     * @constructor
     * @param a {FaceVertex}
     * @param b {FaceVertex}
     * @param c {FaceVertex}
     */
    constructor(a: Vector3, b: Vector3, c: Vector3);
    normal: Vector3;
    static indices(face: Face): number[];
}
export = Face;
