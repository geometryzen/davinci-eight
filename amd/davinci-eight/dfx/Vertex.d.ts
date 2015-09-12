import Simplex = require('../dfx/Simplex');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
declare class Vertex {
    parent: Simplex;
    position: Vector3;
    attributes: {
        [name: string]: VectorN<number>;
    };
    /**
     * The index property is used when computing elements.
     */
    index: number;
    constructor(position: Vector3);
    toString(): string;
}
export = Vertex;
