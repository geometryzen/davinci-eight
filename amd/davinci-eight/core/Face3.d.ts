import Cartesian3 = require('../math/Cartesian3');
import ColorRGB = require('../core/ColorRGB');
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
     * length 3 implies per-vertex normals with correspondence index 0 <=> a, 1 <=> b, 2 <=> c.
     * length 1 implies a face normal.
     * length 0 implies
     */
    vertexNormals: Cartesian3[];
    vertexColors: ColorRGB[];
    vertexTangents: Cartesian3[];
    normal: Cartesian3;
    color: ColorRGB;
    materialIndex: number;
    /**
     * @class Face3
     * @constructor
     * @param a {number}
     * @param b {number}
     * @param c {number}
     * @param normals {Cartesian3[]} The per-vertex normals for this face (3) or face normal (1).
     */
    constructor(a: number, b: number, c: number, vertexNormals?: Cartesian3[]);
    clone(): Face3;
}
export = Face3;
