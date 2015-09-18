import GeometryInfo = require('../dfx/GeometryInfo');
import Simplex = require('../dfx/Simplex');
/**
 * @class Complex
 */
declare class Complex {
    simplices: Simplex[];
    metadata: GeometryInfo;
    dynamic: boolean;
    verticesNeedUpdate: boolean;
    elementsNeedUpdate: boolean;
    uvsNeedUpdate: boolean;
    constructor();
    protected mergeVertices(precisionPoints?: number): void;
    boundary(count?: number): void;
    subdivide(count?: number): void;
    check(): void;
}
export = Complex;
