import VectorN = require('../math/VectorN');
declare class ElementsAttribute {
    vector: VectorN<number>;
    size: number;
    constructor(vector: VectorN<number>, size: number);
}
export = ElementsAttribute;
