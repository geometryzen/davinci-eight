import DrawAttribute = require('../dfx/DrawAttribute');
import VectorN = require('../math/VectorN');
declare class DrawElements {
    indices: VectorN<number>;
    attributes: {
        [name: string]: DrawAttribute;
    };
    constructor(indices: VectorN<number>, attributes: {
        [name: string]: DrawAttribute;
    });
}
export = DrawElements;
