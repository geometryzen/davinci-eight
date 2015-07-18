import Vector3 = require('../math/Vector3');
declare class Face3 {
    a: number;
    b: number;
    c: number;
    normal: Vector3;
    /**
     * 0 <=> a, 1 <=> b, 2 <=> c
     */
    vertexNormals: Vector3[];
    constructor(a: number, b: number, c: number, normal?: Vector3 | Array<Vector3>);
}
export = Face3;
