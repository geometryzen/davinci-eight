import Shareable = require('../utils/Shareable');
import Spinor3 = require('../math/Spinor3');
import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import IProperties = require('../animate/IProperties');
import Vector3 = require('../math/Vector3');
/**
 * @class ModelFacet
 */
declare class ModelFacet extends Shareable implements IFacet, IProperties {
    static PROP_ATTITUDE: string;
    static PROP_POSITION: string;
    private _position;
    private _attitude;
    private _scaleXYZ;
    private M;
    private N;
    private R;
    private S;
    private T;
    /**
     * ModelFacet implements IFacet required for manipulating a body.
     * @class ModelFacet
     * @constructor
     */
    constructor();
    /**
     * @method destructor
     * @return {void}
     */
    protected destructor(): void;
    /**
     * @property attitude
     * @type Spinor3
     * @readOnly
     */
    attitude: Spinor3;
    /**
     * @property position
     * @type Vector3
     * @readOnly
     */
    position: Vector3;
    /**
     * @property scaleXYZ
     * @type Vector3
     * @readOnly
     */
    scaleXYZ: Vector3;
    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[];
    /**
     * @method setProperty
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    setProperty(name: string, data: number[]): void;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = ModelFacet;
