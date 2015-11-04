import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
import R3 = require('../math/R3');
/**
 * @class Vector3Facet
 */
declare class Vector3Facet extends Shareable implements IFacet {
    private _name;
    private _vector;
    /**
     * @class Vector3Facet
     * @constructor
     * @param name {string}
     * @param vector {R3}
     */
    constructor(name: string, vector: R3);
    protected destructor(): void;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): void;
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = Vector3Facet;
