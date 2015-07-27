import Vector3 = require('../math/Vector3');
/**
 * @class Face3
 */
declare class Face3 {
    a: number;
    b: number;
    c: number;
    normal: Vector3;
    /**
     * 0 <=> a, 1 <=> b, 2 <=> c
     */
    vertexNormals: Vector3[];
    /**
     * @class Face3
     * @constructor
     * @param a {number}
     * @param b {number}
     * @param c {number}
     */
    constructor(a: number, b: number, c: number, normal?: Vector3, vertexNormals?: Vector3[]);
}
export = Face3;
