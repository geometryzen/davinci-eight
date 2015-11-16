import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
/**
 * @class PointSizeFacet
 */
declare class PointSizeFacet extends Shareable implements IFacet {
    /**
     * @property pointSize
     * @type {number}
     */
    pointSize: number;
    /**
     * @class PointSizeFacet
     * @constructor
     * @param [pointSize = 2] {number}
     */
    constructor(pointSize?: number);
    protected destructor(): void;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): void;
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = PointSizeFacet;
