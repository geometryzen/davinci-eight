import VectorN = require('../math/VectorN');
declare class Elements {
    indices: VectorN<number>;
    attributes: {
        [name: string]: VectorN<number>;
    };
    constructor(indices: VectorN<number>, attributes: {
        [name: string]: VectorN<number>;
    });
}
export = Elements;
