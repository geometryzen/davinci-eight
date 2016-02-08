import Mesh from '../scene/Mesh'
import ColorFacet from '../facets/ColorFacet';
import Color from '../core/Color';
import G3 from '../math/G3';
import ModelFacet from '../facets/ModelFacet';
import mustBeObject from '../checks/mustBeObject';
import readOnly from '../i18n/readOnly';
import Geometry from '../scene/Geometry';
import Material from '../core/Material';

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

/**
 * @class RigidBody
 */
export default class RigidBody extends Mesh {
    private _mass = G3.zero.clone()
    private _momentum = G3.zero.clone()
    private _axis = G3.zero.clone()

    /**
     * @class RigidBody
     * @constructor
     * @param buffers {Geometry}
     * @param program {Material}
     * @param [type = 'RigidBody'] {string}
     */
    constructor(buffers: Geometry, program: Material, type = 'RigidBody') {
        super(buffers, program, type)

        const modelFacet = new ModelFacet()
        this.setFacet(MODEL_FACET_NAME, modelFacet)
        modelFacet.release()

        const colorFacet = new ColorFacet()
        this.setFacet(COLOR_FACET_NAME, colorFacet)
        colorFacet.release()
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }

    /**
     * Axis (vector)
     *
     * @property axis
     * @type G3
     */
    get axis(): G3 {
        // The initial axis of the geometry is e2.
        this._axis.copy(G3.e2)
        this._axis.rotate(this.R)
        return this._axis.clone()
    }
    set axis(axis: G3) {
        mustBeObject('axis', axis)
        this.R.rotorFromDirections(axis, G3.e2)
    }

    /**
     * Color
     *
     * @property color
     * @type Color
     */
    get color() {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        const color = facet.color
        facet.release()
        return color
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        facet.color.copy(color)
        facet.release()
    }

    /**
     * Mass
     *
     * @property m
     * @type G3
     */
    get m(): G3 {
        return this._mass
    }
    set m(m: G3) {
        mustBeObject('m', m, () => { return this._type })
        this._mass.copy(m).grade(0)
    }

    /**
     * Momentum
     *
     * @property P
     * @type G3
     */
    get P(): G3 {
        return this._momentum
    }
    set P(P: G3) {
        this._momentum.copyVector(P)
    }

    /**
     * Attitude (spinor)
     *
     * @property R
     * @type G3
     */
    get R(): G3 {
        return this._model.R
    }
    set R(R: G3) {
        this._model.R.copySpinor(R)
    }

    /**
     * Position (vector)
     *
     * @property X
     * @type G3
     */
    get X(): G3 {
        return this._model.X
    }
    set X(X: G3) {
        mustBeObject('X', X, () => { return this._type })
        this._model.X.copyVector(X)
    }

    /**
     * @method getScaleX
     * @return {number}
     * @protected
     */
    protected getScaleX(): number {
        return this._model.scaleXYZ.x
    }

    /**
     * @method setScaleX
     * @param x {number}
     * @return {void}
     * @protected
     */
    protected setScaleX(x: number): void {
        this._model.scaleXYZ.x = x
    }

    /**
     * @method getScaleY
     * @return {number}
     * @protected
     */
    protected getScaleY(): number {
        return this._model.scaleXYZ.y
    }

    /**
     * @method setScaleY
     * @param y {number}
     * @return {void}
     * @protected
     */
    protected setScaleY(y: number): void {
        this._model.scaleXYZ.y = y
    }

    /**
     * @method getScaleZ
     * @return {number}
     * @protected
     */
    protected getScaleZ(): number {
        return this._model.scaleXYZ.z
    }

    /**
     * @method setScaleZ
     * @param z {number}
     * @return {void}
     * @protected
     */
    protected setScaleZ(z: number): void {
        this._model.scaleXYZ.z = z
    }

    /**
     * Helper method for accessing the model.
     * The underscore notation should suggest that a release call is not required.
     *
     * @method _model
     * @type Modelfacet
     */
    private get _model(): ModelFacet {
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        model.release()
        return model
    }
    private set _model(unused: ModelFacet) {
        throw new Error(readOnly('_model').message)
    }
}
