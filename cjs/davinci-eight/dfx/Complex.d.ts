import Simplex = require('../dfx/Simplex');
/**
 * @class Complex
 */
declare class Complex {
    simplices: Simplex[];
    dynamic: boolean;
    verticesNeedUpdate: boolean;
    elementsNeedUpdate: boolean;
    uvsNeedUpdate: boolean;
    constructor();
    protected mergeVertices(precisionPoints?: number): void;
    boundary(count?: number): void;
    subdivide(count?: number): void;
}
export = Complex;
