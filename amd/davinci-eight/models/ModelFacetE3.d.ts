import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IUnknownExt = require('../core/IUnknownExt');
import ModelE3 = require('../physics/ModelE3');
import R3 = require('../math/R3');
/**
 * @class ModelFacetE3
 */
declare class ModelFacetE3 extends ModelE3 implements IFacet, IAnimationTarget, IUnknownExt<ModelFacetE3> {
    static PROP_SCALEXYZ: string;
    private _scaleXYZ;
    private matM;
    private matN;
    private matR;
    private matS;
    private matT;
    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the drawable object may represent a rigid body.
     * In Computer Graphics, the drawable object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacetE3 implements IFacet required for manipulating a drawable object.
     * </p>
     * <p>
     * Constructs a ModelFacetE3 at the origin and with unity attitude.
     * </p>
     * @class ModelFacetE3
     * @constructor
     * @param type [string = 'ModelFacetE3'] The name used for reference counting.
     */
    constructor(type?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @property scaleXYZ
     * @type R3
     * @readOnly
     */
    scaleXYZ: R3;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
    /**
     * @method incRef
     * @return {ModelFacetE3}
     * @chainable
     */
    incRef(): ModelFacetE3;
    /**
     * @method decRef
     * @return {ModelFacetE3}
     * @chainable
     */
    decRef(): ModelFacetE3;
}
export = ModelFacetE3;
