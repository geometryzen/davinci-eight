import ElementsAttribute = require('../dfx/ElementsAttribute');
import VectorN = require('../math/VectorN');
declare class Elements {
    indices: VectorN<number>;
    attributes: {
        [name: string]: ElementsAttribute;
    };
    constructor(indices: VectorN<number>, attributes: {
        [name: string]: ElementsAttribute;
    });
}
export = Elements;
