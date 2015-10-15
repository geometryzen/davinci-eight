import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
/**
 * @class PointSize
 */
declare class PointSize extends Shareable implements IFacet {
    pointSize: number;
    /**
     * @class PointSize
     * @constructor
     */
    constructor(pointSize?: number);
    protected destructor(): void;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): void;
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = PointSize;
