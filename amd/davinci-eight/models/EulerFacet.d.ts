import IFacet = require('../core/IFacet');
import Shareable = require('../utils/Shareable');
import IFacetVisitor = require('../core/IFacetVisitor');
import Vector3 = require('../math/Vector3');
/**
 * @class EulerFacet
 */
declare class EulerFacet extends Shareable implements IFacet {
    private _rotation;
    /**
     * @class EulerFacet
     * @constructor
     */
    constructor();
    protected destructor(): void;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): void;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
    /**
     * @property rotation
     * @type {Vector3}
     * @readOnly
     */
    rotation: Vector3;
}
export = EulerFacet;
