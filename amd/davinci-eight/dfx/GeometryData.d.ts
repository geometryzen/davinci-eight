import DrawAttribute = require('../dfx/DrawAttribute');
import VectorN = require('../math/VectorN');
declare class GeometryData {
    /**
     * 0 => POINTS, 1 => LINES, 2 => TRIANGLES
     */
    k: number;
    indices: VectorN<number>;
    attributes: {
        [name: string]: DrawAttribute;
    };
    constructor(k: number, indices: VectorN<number>, attributes: {
        [name: string]: DrawAttribute;
    });
}
export = GeometryData;
