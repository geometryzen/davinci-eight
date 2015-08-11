import Vector3 = require('../math/Vector3');
/**
 * @class Face3
 */
declare class Face3 {
    /**
     * @property a {number} The index of the vertex with label 'a' in the array of vertices.
     */
    a: number;
    /**
     * @property b {number} The index of the vertex with label 'b' in the array of vertices.
     */
    b: number;
    /**
     * @property c {number} The index of the vertex with label 'c' in the array of vertices.
     */
    c: number;
    /**
     * length 3 implies index 0 <=> a, 1 <=> b, 2 <=> c. length 1 implies a face normal.
     */
    normals: Vector3[];
    /**
     * @class Face3
     * @constructor
     * @param a {number}
     * @param b {number}
     * @param c {number}
     * @param normals {Vector3[]} The per-vertex normals for this face (3) or face normal (1).
     */
    constructor(a: number, b: number, c: number, normals?: Vector3[]);
}
export = Face3;
