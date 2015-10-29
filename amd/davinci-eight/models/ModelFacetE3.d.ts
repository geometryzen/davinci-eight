import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IUnknownExt = require('../core/IUnknownExt');
import G3 = require('../math/G3');
import R3 = require('../math/R3');
import Shareable = require('../utils/Shareable');
/**
 * @class ModelFacetE3
 */
declare class ModelFacetE3 extends Shareable implements IFacet, IAnimationTarget, IUnknownExt<ModelFacetE3> {
    /**
     * The name of the property that designates the attitude.
     * @property PROP_ATTITUDE
     * @type {string}
     * @default 'R'
     * @static
     * @readOnly
     */
    static PROP_ATTITUDE: string;
    /**
     * The name of the property that designates the position.
     * @property PROP_POSITION
     * @type {string}
     * @default 'X'
     * @static
     * @readOnly
     */
    static PROP_POSITION: string;
    static PROP_SCALEXYZ: string;
    private _position;
    private _attitude;
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
     * <p>
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     * @property R
     * @type G3
     * @readOnly
     */
    R: G3;
    /**
     * <p>
     * The <em>position</em>, a vector.
     * The vector <b>X</b> designates the center of mass of the body (Physics).
     * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
     * </p>
     *
     * @property X
     * @type G3
     * @readOnly
     */
    X: G3;
    /**
     * @property scaleXYZ
     * @type R3
     * @readOnly
     */
    scaleXYZ: R3;
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
