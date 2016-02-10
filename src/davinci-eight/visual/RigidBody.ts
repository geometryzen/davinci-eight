import Mesh from '../core/Mesh'
import ColorFacet from '../facets/ColorFacet';
import Color from '../core/Color';
import G3 from '../math/G3';
import ModelFacet from '../facets/ModelFacet';
import mustBeObject from '../checks/mustBeObject';
import readOnly from '../i18n/readOnly';
import Geometry from '../core/Geometry';
import Material from '../core/Material';

/**
 * Convenient abstractions for Physics modeling.
 *
 * @module EIGHT
 * @submodule visual
 */

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

/**
 * @class RigidBody
 * @extends Mesh
 */
export default class RigidBody extends Mesh {

    /**
     * @property _mass
     * @type G3
     * @default zero
     * @private
     */
    private _mass = G3.zero.clone()

    /**
     * @property _momentum
     * @type G3
     * @default zero
     * @private
     */
    private _momentum = G3.zero.clone()

    /**
     * @property _axis
     * @type G3
     * @default zero
     * @private
     */
    private _axis = G3.zero.clone()

    /**
     * Provides descriptive variables for translational and rotational motion.
     * This class is intended to be used as a base for bodies in the __visual__ module.
     *
     * @class RigidBody
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param [type = 'RigidBody'] {string}
     */
    constructor(geometry: Geometry, material: Material, type = 'RigidBody') {
        super(geometry, material, type)

        const modelFacet = new ModelFacet()
        this.setFacet(MODEL_FACET_NAME, modelFacet)

        const colorFacet = new ColorFacet()
        this.setFacet(COLOR_FACET_NAME, colorFacet)
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
     * This property is computed from the attitude spinor assuming a reference axis of e2.
     * The axis property may be updated by assignment, but not through mutation.
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
        return color
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        facet.color.copy(color)
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
     * The property getter returns a reference to a variable that is used to determine
     * the location. Consequently, mutation of the returned variable affects the location
     * of the body.
     *
     * @example
     *     const position = rigidBody.X
     *
     * Changing the position variable will affect the rigidBody.
     *
     * The property setter copies the right hand side of the assignment into the X property.
     *
     * @example
     *     const position = new G3()
     *     rigidBody.X = position
     *
     * Changing the position variable has no effect on the rigidBody.
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
     *
     * @property _model
     * @type ModelFacet
     * @readOnly
     * @private
     */
    private get _model(): ModelFacet {
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        return model
    }
    private set _model(unused: ModelFacet) {
        throw new Error(readOnly('_model').message)
    }
}
