import Color = require('../core/Color')
import Euclidean3 = require('../math/Euclidean3')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import IAnimationTarget = require('../slideshow/IAnimationTarget')
import isUndefined = require('../checks/isUndefined')
import IUnknownExt = require('../core/IUnknownExt')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import mustBeString = require('../checks/mustBeString')
import G3 = require('../math/G3')
import R3 = require('../math/R3')
import readOnly = require('../i18n/readOnly');
import Shareable = require('../utils/Shareable')
import Symbolic = require('../core/Symbolic')

/**
 * @class ModelFacet
 */
class ModelFacet extends Shareable implements IFacet, IAnimationTarget, IUnknownExt<ModelFacet> {
    /**
     * The name of the property that designates the attitude.
     * @property PROP_ATTITUDE
     * @type {string}
     * @default 'R'
     * @static
     * @readOnly
     */
    public static PROP_ATTITUDE = 'R';
    /**
     * The name of the property that designates the position.
     * @property PROP_POSITION
     * @type {string}
     * @default 'X'
     * @static
     * @readOnly
     */
    public static PROP_POSITION = 'X';
    // FIXME: Make this scale so that we can be geometric?
    public static PROP_SCALEXYZ = 'scaleXYZ';

    private _position = new G3().copy(Euclidean3.zero);
    private _attitude = new G3().copy(Euclidean3.one);
    // FIXME: I don't like this non-geometric scaling.
    private _scaleXYZ: R3 = new R3([1, 1, 1]);
    private matM = Matrix4.identity();
    private matN = Matrix3.identity();
    private matR = Matrix4.identity();
    private matS = Matrix4.identity();
    private matT = Matrix4.identity();
    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the drawable object may represent a rigid body.
     * In Computer Graphics, the drawable object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacet implements IFacet required for manipulating a drawable object.
     * </p>
     * <p>
     * Constructs a ModelFacet at the origin and with unity attitude.
     * </p>
     * @class ModelFacet
     * @constructor
     * @param type [string = 'ModelFacet'] The name used for reference counting.
     */
    constructor(type: string = 'ModelFacet') {
        super(mustBeString('type', type))
        this._position.modified = true
        this._attitude.modified = true
        this._scaleXYZ.modified = true
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._position = void 0
        this._attitude = void 0
        this._scaleXYZ = void 0
        this.matM = void 0
        this.matN = void 0
        this.matR = void 0
        this.matS = void 0
        this.matT = void 0
    }
    /**
     * <p>
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     * @property R
     * @type G3
     * @readOnly
     */
    get R(): G3 {
        return this._attitude
    }
    set R(unused) {
        throw new Error(readOnly(ModelFacet.PROP_ATTITUDE).message)
    }
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
    get X(): G3 {
        return this._position
    }
    set X(unused) {
        throw new Error(readOnly(ModelFacet.PROP_POSITION).message)
    }
    /**
     * @property scaleXYZ
     * @type R3
     * @readOnly
     */
    get scaleXYZ(): R3 {
        return this._scaleXYZ
    }
    set scaleXYZ(unused) {
        throw new Error(readOnly(ModelFacet.PROP_SCALEXYZ).message)
    }
    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[] {
        switch (name) {
            case ModelFacet.PROP_ATTITUDE: {
                return [this._attitude.yz, this._attitude.zx, this._attitude.xy, this._attitude.α]
            }
            case ModelFacet.PROP_POSITION: {
                return [this._position.x, this._position.y, this._position.z]
            }
            default: {
                console.warn("ModelFacet.getProperty " + name)
                return void 0
            }
        }
    }
    /**
     * @method setProperty
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    setProperty(name: string, data: number[]): void {
        switch (name) {
            case ModelFacet.PROP_ATTITUDE: {
                this._attitude.zero()
                this._attitude.yz = data[0]
                this._attitude.zx = data[1]
                this._attitude.xy = data[2]
                this._attitude.α = data[3]
            }
                break;
            case ModelFacet.PROP_POSITION: {
                this._position.zero()
                this._position.x = data[0]
                this._position.y = data[1]
                this._position.z = data[2]
            }
                break;
            default: {
                console.warn("ModelFacet.setProperty " + name)
            }
        }
    }
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number) {
        if (this._position.modified) {
            this.matT.translation(this._position)
            this._position.modified = false
        }
        if (this._attitude.modified) {
            this.matR.rotation(this._attitude)
            this._attitude.modified = false
        }
        if (this.scaleXYZ.modified) {
            this.matS.scaling(this.scaleXYZ)
            this.scaleXYZ.modified = false
        }
        this.matM.copy(this.matT).mul(this.matR).mul(this.matS)

        this.matN.normalFromMatrix4(this.matM)

        visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.matM, canvasId)
        visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.matN, canvasId)
    }
    /**
     * @method incRef
     * @return {ModelFacet}
     * @chainable
     */
    incRef(): ModelFacet {
        this.addRef()
        return this
    }
    /**
     * @method decRef
     * @return {ModelFacet}
     * @chainable
     */
    decRef(): ModelFacet {
        this.release()
        return this
    }
}

export = ModelFacet
