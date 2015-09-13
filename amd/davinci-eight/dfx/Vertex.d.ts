import Simplex = require('../dfx/Simplex');
import VectorN = require('../math/VectorN');
declare class Vertex {
    parent: Simplex;
    opposing: Simplex[];
    attributes: {
        [name: string]: VectorN<number>;
    };
    /**
     * The index property is used when computing elements.
     */
    index: number;
    constructor();
    toString(): string;
}
export = Vertex;
