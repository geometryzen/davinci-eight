import Simplex = require('../dfx/Simplex');
/**
 * @class Geometry
 */
declare class Geometry {
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
export = Geometry;
