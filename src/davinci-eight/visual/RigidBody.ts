import Euclidean3 from '../math/Euclidean3';
import mustBeObject from '../checks/mustBeObject';
import Object3D from './Object3D';
import Geometry from '../core/Geometry';
import Material from '../core/Material';

/**
 * Convenient abstractions for Physics modeling.
 *
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class RigidBody
 * @extends Object3D
 */
export default class RigidBody extends Object3D {

    /**
     * @property _mass
     * @type Euclidean3
     * @default one
     * @private
     */
    private _mass = Euclidean3.one

    /**
     * @property _momentum
     * @type Euclidean3
     * @default zero
     * @private
     */
    private _momentum = Euclidean3.zero

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
     * @type Euclidean3
     */
    get axis(): Euclidean3 {
        // The initial axis of the geometry is e2.
        return Euclidean3.e2.rotate(this.modelFacet.R)
    }
    set axis(axis: Euclidean3) {
        mustBeObject('axis', axis)
        this.modelFacet.R.rotorFromDirections(axis, Euclidean3.e2)
    }

    /**
     * Mass
     *
     * @property m
     * @type Euclidean3
     */
    get m(): Euclidean3 {
        return this._mass
    }
    set m(m: Euclidean3) {
        mustBeObject('m', m, () => { return this._type })
        this._mass = m
    }

    /**
     * Momentum
     *
     * @property P
     * @type Euclidean3
     */
    get P(): Euclidean3 {
        return this._momentum
    }
    set P(P: Euclidean3) {
        this._momentum = P
    }

    /**
     * Attitude (spinor)
     *
     * @property R
     * @type Euclidean3
     */
    get R(): Euclidean3 {
        return Euclidean3.copy(this.modelFacet.R)
    }
    set R(R: Euclidean3) {
        this.modelFacet.R.copySpinor(R)
    }

    /**
     * Position (vector)
     *
     * @property X
     * @type Euclidean3
     */
    get X(): Euclidean3 {
        return Euclidean3.copy(this.modelFacet.X)
    }
    set X(X: Euclidean3) {
        mustBeObject('X', X, () => { return this._type })
        this.modelFacet.X.copyVector(X)
    }

    /**
     * @method getScaleX
     * @return {number}
     * @protected
     */
    protected getScaleX(): number {
        return this.modelFacet.scaleXYZ.x
    }

    /**
     * @method setScaleX
     * @param x {number}
     * @return {void}
     * @protected
     */
    protected setScaleX(x: number): void {
        this.modelFacet.scaleXYZ.x = x
    }

    /**
     * @method getScaleY
     * @return {number}
     * @protected
     */
    protected getScaleY(): number {
        return this.modelFacet.scaleXYZ.y
    }

    /**
     * @method setScaleY
     * @param y {number}
     * @return {void}
     * @protected
     */
    protected setScaleY(y: number): void {
        this.modelFacet.scaleXYZ.y = y
    }

    /**
     * @method getScaleZ
     * @return {number}
     * @protected
     */
    protected getScaleZ(): number {
        return this.modelFacet.scaleXYZ.z
    }

    /**
     * @method setScaleZ
     * @param z {number}
     * @return {void}
     * @protected
     */
    protected setScaleZ(z: number): void {
        this.modelFacet.scaleXYZ.z = z
    }
}
