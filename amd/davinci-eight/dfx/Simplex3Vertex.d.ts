import Simplex3 = require('../dfx/Simplex3');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
declare class Simplex3Vertex {
    private _parent;
    position: Vector3;
    normal: Vector3;
    attributes: {
        [name: string]: VectorN<number>;
    };
    index: number;
    constructor(position: Vector3, normal?: Vector3);
    parent: Simplex3;
}
export = Simplex3Vertex;
