/**
 * @class Geometry
 */
declare class Geometry {
    dynamic: boolean;
    verticesNeedUpdate: boolean;
    elementsNeedUpdate: boolean;
    uvsNeedUpdate: boolean;
    constructor();
    protected mergeVertices(precisionPoints?: number): void;
}
export = Geometry;
