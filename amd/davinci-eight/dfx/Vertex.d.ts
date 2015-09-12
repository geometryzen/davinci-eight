import Simplex = require('../dfx/Simplex');
import VectorN = require('../math/VectorN');
declare class Vertex {
    parent: Simplex;
    attributes: {
        [name: string]: VectorN<number>;
    };
    /**
     * The index property is used when computing elements.
     */
    index: number;
    constructor(position: VectorN<number>);
    toString(): string;
}
export = Vertex;
